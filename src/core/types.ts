/**
 * Ambient Pomodoro Core Types
 * Based on docs/03-state-machine.md
 */

export enum TimerMode {
    IDLE = 'idle',
    FOCUS = 'focus',
    BREAK = 'break',
    LONG_BREAK = 'long-break',
    PAUSED = 'paused',
}

export enum TimerEvent {
    START = 'START',
    PAUSE = 'PAUSE',
    RESUME = 'RESUME',
    STOP = 'STOP',
    NEXT_MODE = 'NEXT_MODE',
    SWITCH_TO_FOCUS = 'SWITCH_TO_FOCUS',
    SWITCH_TO_BREAK = 'SWITCH_TO_BREAK',
    SWITCH_TO_LONG_BREAK = 'SWITCH_TO_LONG_BREAK',
    TICK = 'TICK',
    TIME_ELAPSED = 'TIME_ELAPSED',
    APP_BACKGROUND = 'APP_BACKGROUND',
    APP_TERMINATED = 'APP_TERMINATED',
}

export interface TimerContext {
    currentMode: TimerMode;
    previousMode?: TimerMode; // The mode used before entering 'paused'
    elapsedTime: number; // Milliseconds elapsed in current session
    remainingTime: number; // Milliseconds until next signal
    cycleCount: number; // Focus sessions completed since last long-break
    targetTimestamp?: number; // Performance.now() or timestamp of intended completion
    nextReminderTimestamp?: number; // When to send the next "nagging" signal if in overtime
}

export type TimerListener = (context: TimerContext) => void;

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}
