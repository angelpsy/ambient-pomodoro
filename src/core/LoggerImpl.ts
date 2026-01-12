import { ILogger } from './Logger';
import { LogLevel } from './types';
import { logStore } from './LogStore';

/**
 * Basic console logger implementation for Phase 0.
 * Can be extended with file sinks or other targets in the future.
 */
class LoggerImpl implements ILogger {
    private currentLevel: LogLevel = LogLevel.INFO;

    setLevel(level: LogLevel): void {
        this.currentLevel = level;
        this.info(`Log level changed to: ${level}`);
    }

    getLevel(): LogLevel {
        return this.currentLevel;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        return levels.indexOf(level) >= levels.indexOf(this.currentLevel);
    }

    debug(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            const formatted = args.length > 0 ? `${message} ${args.map(a => JSON.stringify(a)).join(' ')}` : message;
            console.debug(`[DEBUG] ${formatted}`);
            logStore.addLog(LogLevel.DEBUG, formatted);
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.INFO)) {
            const formatted = args.length > 0 ? `${message} ${args.map(a => JSON.stringify(a)).join(' ')}` : message;
            console.info(`[INFO] ${formatted}`);
            logStore.addLog(LogLevel.INFO, formatted);
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.WARN)) {
            const formatted = args.length > 0 ? `${message} ${args.map(a => JSON.stringify(a)).join(' ')}` : message;
            console.warn(`[WARN] ${formatted}`);
            logStore.addLog(LogLevel.WARN, formatted);
        }
    }

    error(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            const formatted = args.length > 0 ? `${message} ${args.map(a => JSON.stringify(a)).join(' ')}` : message;
            console.error(`[ERROR] ${formatted}`);
            logStore.addLog(LogLevel.ERROR, formatted);
        }
    }
}

export const logger: ILogger = new LoggerImpl();
