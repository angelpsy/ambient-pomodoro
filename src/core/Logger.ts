import { LogLevel } from './types';

/**
 * Standardized logging interface for the project.
 * Implementation will be defined in the next step.
 */
export interface ILogger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;

    setLevel(level: LogLevel): void;
    getLevel(): LogLevel;
}
