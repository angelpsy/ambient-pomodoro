import {
    TimerContext,
    TimerMode,
    TimerEvent,
    TimerListener,
} from './types';
import { ITimerEngine } from './TimerEngine';
import { logger } from './LoggerImpl';

/**
 * Durations in milliseconds for V0.
 * As per docs/02-requirements.md
 */
const DURATIONS = {
    [TimerMode.FOCUS]: 25 * 60 * 1000,
    [TimerMode.BREAK]: 5 * 60 * 1000,
    [TimerMode.LONG_BREAK]: 15 * 60 * 1000,
    [TimerMode.IDLE]: 0,
    [TimerMode.PAUSED]: 0,
};

export class TimerEngineImpl implements ITimerEngine {
    private context: TimerContext;
    private listeners: Set<TimerListener> = new Set();
    private intervalId: ReturnType<typeof setInterval> | null = null;

    constructor() {
        this.context = {
            currentMode: TimerMode.IDLE,
            elapsedTime: 0,
            remainingTime: 0,
            cycleCount: 0,
        };
        logger.info('TimerEngine initialized in IDLE mode');
    }

    public getState(): TimerContext {
        return { ...this.context };
    }

    public subscribe(callback: TimerListener): () => void {
        this.listeners.add(callback);
        // Emit current state immediately on subscription
        callback(this.getState());
        return () => this.listeners.delete(callback);
    }

    private emitChange(): void {
        const currentState = this.getState();
        this.listeners.forEach((listener) => listener(currentState));
    }

    public start(): void {
        if (this.context.currentMode !== TimerMode.IDLE) {
            logger.warn(`START called in ${this.context.currentMode} mode. Ignoring.`);
            return;
        }

        this.transitionTo(TimerMode.FOCUS);
        this.startTicking();
    }

    public pause(): void {
        if (this.context.currentMode === TimerMode.IDLE || this.context.currentMode === TimerMode.PAUSED) {
            return;
        }

        this.stopTicking();
        this.context.previousMode = this.context.currentMode;
        this.context.currentMode = TimerMode.PAUSED;
        this.context.targetTimestamp = undefined;

        logger.info(`Timer PAUSED from ${this.context.previousMode}`);
        this.emitChange();
    }

    public resume(): void {
        if (this.context.currentMode !== TimerMode.PAUSED || !this.context.previousMode) {
            return;
        }

        const modeToResume = this.context.previousMode;
        logger.info(`Timer RESUMING to ${modeToResume}`);

        this.context.currentMode = modeToResume;
        this.context.previousMode = undefined;

        // Recalculate target timestamp based on remaining time
        this.context.targetTimestamp = Date.now() + this.context.remainingTime;

        this.startTicking();
    }

    public stop(): void {
        logger.info('Timer STOPPED and RESET');
        this.stopTicking();
        this.context = {
            currentMode: TimerMode.IDLE,
            elapsedTime: 0,
            remainingTime: 0,
            cycleCount: 0,
        };
        this.emitChange();
    }

    public next(): void {
        const current = this.context.currentMode;

        // Cycle increment only happens when transitioning OUT of FOCUS
        if (current === TimerMode.FOCUS) {
            this.context.cycleCount++;
            logger.info(`Focus session completed (manual). Cycle count: ${this.context.cycleCount}`);

            const isLongBreak = this.context.cycleCount > 0 && this.context.cycleCount % 4 === 0;
            this.transitionTo(isLongBreak ? TimerMode.LONG_BREAK : TimerMode.BREAK);
        } else if (current === TimerMode.BREAK || current === TimerMode.LONG_BREAK) {
            this.transitionTo(TimerMode.FOCUS);
        } else {
            this.transitionTo(TimerMode.FOCUS);
        }

        this.startTicking();
    }

    public switchToFocus(): void {
        this.handleManualTransitionFromCurrent();
        this.transitionTo(TimerMode.FOCUS);
        this.startTicking();
    }

    public switchToBreak(): void {
        this.handleManualTransitionFromCurrent();
        this.transitionTo(TimerMode.BREAK);
        this.startTicking();
    }

    public switchToLongBreak(): void {
        this.handleManualTransitionFromCurrent();
        this.transitionTo(TimerMode.LONG_BREAK);
        this.startTicking();
    }

    /**
     * Internal helper to handle cycle logic when switching modes manually.
     */
    private handleManualTransitionFromCurrent(): void {
        if (this.context.currentMode === TimerMode.FOCUS) {
            this.context.cycleCount++;
            logger.info(`Focus session completed (manual override). Cycle count: ${this.context.cycleCount}`);
        }
    }

    private transitionTo(mode: TimerMode): void {
        const prev = this.context.currentMode;
        const duration = DURATIONS[mode];

        logger.info(`Transition: ${prev} -> ${mode} (Duration: ${duration}ms)`);

        this.context.currentMode = mode;
        this.context.previousMode = undefined;
        this.context.elapsedTime = 0;
        this.context.remainingTime = duration;
        this.context.targetTimestamp = Date.now() + duration;

        // Reset cycle count logic as per docs/03-state-machine.md
        if (mode === TimerMode.FOCUS && prev === TimerMode.LONG_BREAK) {
            this.context.cycleCount = 0;
        }

        this.emitChange();
    }

    private startTicking(): void {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    private stopTicking(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private tick(): void {
        if (this.context.currentMode === TimerMode.IDLE || this.context.currentMode === TimerMode.PAUSED) {
            this.stopTicking();
            return;
        }

        const now = Date.now();
        const startTime = (this.context.targetTimestamp || now) - DURATIONS[this.context.currentMode];

        // Elapsed time calculation: how much has passed since the mode started
        const elapsed = now - startTime;

        // Remaining time calculation
        const duration = DURATIONS[this.context.currentMode];
        const remaining = duration - elapsed;

        // Check if transition from positive to negative remaining time just happened (for signal)
        const crossedZero = this.context.remainingTime > 0 && remaining <= 0;

        this.context.remainingTime = remaining;
        this.context.elapsedTime = elapsed;

        if (crossedZero) {
            this.handleTimeElapsed();
        }

        this.emitChange();
    }

    private handleTimeElapsed(): void {
        logger.info(`TIME_ELAPSED in mode: ${this.context.currentMode}. User signal triggered.`);
        // In V0, we don't auto-increment cycles here anymore. 
        // We only trigger signals (to be implemented in Task 004).
    }
}
