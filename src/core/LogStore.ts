import { LogLevel } from './types';
import { nativeLog } from './NativeLog';
import { NativeModules } from 'react-native';

export interface LogEntry {
    id: string;
    timestamp: number;
    level: LogLevel;
    message: string;
}

type LogListener = (logs: LogEntry[]) => void;

class LogStore {
    private logs: LogEntry[] = [];
    private listeners: Set<LogListener> = new Set();
    private maxLogs: number = 1000;
    private isInitialized = false;
    private isSaving = false;
    private pendingSave = false;

    public async initialize(): Promise<void> {
        if (this.isInitialized) return;

        const bridgeExists = !!NativeModules.LogNativeModule;
        this.addLog(LogLevel.INFO, `[System] Init start. Native bridge exists: ${bridgeExists}`);

        try {
            const stored = await nativeLog.loadLogs();
            const storedLen = stored?.length || 0;
            this.addLog(LogLevel.INFO, `[System] Load finished. Raw length: ${storedLen}`);

            if (stored && stored.trim() !== '' && stored !== '[]') {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    const preHydrationLogs = [...this.logs];
                    this.logs = [...preHydrationLogs, ...parsed].slice(0, this.maxLogs);
                    this.notify();
                    this.isInitialized = true;
                    this.addLog(LogLevel.INFO, `[System] Hydrated ${parsed.length} entries. Total: ${this.logs.length}`);
                } else {
                    this.addLog(LogLevel.ERROR, `[System] Hydration failed: Data is not an array`);
                    this.isInitialized = true;
                }
            } else {
                this.addLog(LogLevel.INFO, `[System] No previous logs found in storage`);
                this.isInitialized = true;
            }
        } catch (e) {
            this.addLog(LogLevel.ERROR, `[System] Hydration CRASH: ${e}`);
            // isInitialized remains false to prevent overwriting with nothing
        } finally {
            if (this.isInitialized) {
                this.addLog(LogLevel.WARN, `[System] LogStore active. Persistence ready.`);
                this.saveToStorage();
            }
        }
    }

    private async saveToStorage(): Promise<void> {
        if (!this.isInitialized) return;
        if (this.isSaving) {
            this.pendingSave = true;
            return;
        }

        this.isSaving = true;
        this.pendingSave = false;

        try {
            const json = JSON.stringify(this.logs);
            await nativeLog.saveLogs(json);
        } catch (e) {
            // We don't use addLog here to avoid potential infinite loops if save fails
            console.error('[LogStore] Save failed', e);
        } finally {
            this.isSaving = false;
            if (this.pendingSave) {
                setTimeout(() => this.saveToStorage(), 200);
            }
        }
    }

    public addLog(level: LogLevel, message: string): void {
        const entry: LogEntry = {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            level,
            message,
        };

        this.logs.unshift(entry); // Newest first

        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }

        this.notify();
        this.saveToStorage();
    }

    public getLogs(): LogEntry[] {
        return [...this.logs];
    }

    public clear(): void {
        this.logs = [];
        this.notify();
        this.saveToStorage();
    }

    public subscribe(listener: LogListener): () => void {
        this.listeners.add(listener);
        listener(this.getLogs());
        return () => this.listeners.delete(listener);
    }

    private notify(): void {
        const currentLogs = this.getLogs();
        this.listeners.forEach((listener) => listener(currentLogs));
    }
}

export const logStore = new LogStore();
