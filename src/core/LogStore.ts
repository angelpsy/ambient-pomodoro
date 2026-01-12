import { LogLevel } from './types';

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
    private maxLogs: number = 500;

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
    }

    public getLogs(): LogEntry[] {
        return [...this.logs];
    }

    public clear(): void {
        this.logs = [];
        this.notify();
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
