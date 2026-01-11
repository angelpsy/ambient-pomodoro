import { ILogger } from './Logger';
import { LogLevel } from './types';

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
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    error(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }
}

export const logger: ILogger = new LoggerImpl();
