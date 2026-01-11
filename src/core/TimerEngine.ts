import { TimerContext, TimerListener } from './types';

/**
 * ITimerEngine represents the core logic boundary.
 * It manages the State Machine and provides a clean interface for the UI and OS.
 */
export interface ITimerEngine {
    /**
     * Start or resume the timer based on current mode.
     */
    start(): void;

    /**
     * Freeze the current timer state.
     */
    pause(): void;

    /**
     * Resume from paused state.
     */
    resume(): void;

    /**
     * Reset to idle and clear cycle counters.
     */
    stop(): void;

    /**
     * Transition to the next suggested mode in the sequence.
     */
    next(): void;

    /**
     * Manual overrides to switch to specific modes.
     */
    switchToFocus(): void;
    switchToBreak(): void;
    switchToLongBreak(): void;

    /**
     * Subscription to state changes.
     * Returns an unsubscribe function.
     */
    subscribe(callback: TimerListener): () => void;

    /**
     * Synchronous access to current state.
     */
    getState(): TimerContext;
}
