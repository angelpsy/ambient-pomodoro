import {
    TimerContext,
    TimerMode,
    TimerListener,
} from './types';
import { ITimerEngine } from './TimerEngine';
import { logger } from './LoggerImpl';
import { nativeTimer } from './NativeTimer';
import { NativeEventEmitter, NativeModules } from 'react-native';

const { TimerNativeModule } = NativeModules;
// Safety: In some environments (e.g. tests or early boot), Module might be null
const timerEmitter = TimerNativeModule ? new NativeEventEmitter(TimerNativeModule) : null;

/**
 * Durations in milliseconds for V0.
 * As per docs/02-requirements.md
 */
const DURATIONS = {
    [TimerMode.FOCUS]: 25 * 1000,
    [TimerMode.BREAK]: 5 * 1000,
    [TimerMode.LONG_BREAK]: 15 * 1000,
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

        // Listen for native events (from notification actions)
        timerEmitter?.addListener('onTimerNext', () => {
            logger.info('Received onTimerNext from native');
            this.next();
        });

        // Listen for when a native alarm actually fires
        timerEmitter?.addListener('onAlarmFired', (data: any) => {
            logger.info(`Native alarm fired for: ${data.mode}`);
            // If we are still in this mode, schedule the next nagging reminder
            if (this.context.currentMode === data.mode) {
                this.scheduleNextReminder();
            }
        });

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
        if (this.context.currentMode === TimerMode.PAUSED) return;

        this.stopTicking();
        this.context.previousMode = this.context.currentMode;
        this.context.currentMode = TimerMode.PAUSED;

        // Cancel native alarm on pause
        nativeTimer.cancelAlarm().catch((e: any) => logger.error(`Failed to cancel alarm: ${e}`));

        logger.info('Timer PAUSED');
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
        this.stopTicking();
        this.context = {
            currentMode: TimerMode.IDLE,
            elapsedTime: 0,
            remainingTime: 0,
            cycleCount: 0,
        };

        // Cancel native alarm on stop
        nativeTimer.cancelAlarm().catch((e: any) => logger.error(`Failed to cancel alarm: ${e}`));

        logger.info('Timer STOPPED and RESET');
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
        this.context.nextReminderTimestamp = undefined;

        if (mode === TimerMode.IDLE) {
            this.context.targetTimestamp = undefined;
            nativeTimer.cancelAlarm().catch((e: any) => logger.error(`Failed to cancel alarm: ${e}`));
        } else {
            const target = Date.now() + duration;
            this.context.targetTimestamp = target;

            // Native scheduling: set alarm for the end of the duration
            // Note: For initial transitions, we use the exact duration.
            // Frequency constraints (e.g. 1min) only apply to reminders (Task 004 nagging).
            nativeTimer.scheduleAlarm(target, mode)
                .catch((e: any) => logger.error(`Failed to schedule alarm: ${e}`));
        }

        // Clear any old notifications when transitioning to a new mode
        nativeTimer.clearSignalNotification().catch((e: any) => logger.error(`Failed to clear notification: ${e}`));

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
        // In V0, we don't auto-increment cycles. 
        // We schedule the NEXT reminder using the current mode duration.
        this.scheduleNextReminder();
    }

    private scheduleNextReminder(): void {
        const mode = this.context.currentMode;
        if (mode === TimerMode.IDLE || mode === TimerMode.PAUSED) return;

        // Constraint: not more often than once a minute
        const modeDuration = DURATIONS[mode];
        const reminderInterval = Math.max(modeDuration, 60 * 1000);

        const nextTime = Date.now() + reminderInterval;

        logger.info(`Scheduling next reminder for ${mode} in ${reminderInterval}ms (mode duration: ${modeDuration}ms)`);
        this.context.nextReminderTimestamp = nextTime;

        // Schedule next exact alarm
        nativeTimer.scheduleAlarm(nextTime, mode)
            .catch((e: any) => logger.error(`Failed to schedule reminder alarm: ${e}`));
    }
}
