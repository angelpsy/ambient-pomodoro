import {
    TimerContext,
    TimerMode,
    TimerListener,
    TimerSettings,
} from './types';
import { ITimerEngine } from './TimerEngine';
import { logger } from './LoggerImpl';
import { nativeTimer } from './NativeTimer';
import { TimerStateStorage } from './TimerStateStorage';
import { TimerSettingsStorage } from './TimerSettingsStorage';
import { NativeEventEmitter, NativeModules } from 'react-native';

const { TimerNativeModule } = NativeModules;
// Safety: In some environments (e.g. tests or early boot), Module might be null
const timerEmitter = TimerNativeModule ? new NativeEventEmitter(TimerNativeModule) : null;

/**
 * Durations in milliseconds for V0.
 * As per docs/02-requirements.md
 */
const DEFAULT_SETTINGS: TimerSettings = {
    durationsMs: {
        focus: 25 * 60 * 1000,
        break: 5 * 60 * 1000,
        longBreak: 15 * 60 * 1000,
    },
    reminderIntervalsMs: {
        focus: 25 * 60 * 1000,
        break: 5 * 60 * 1000,
        longBreak: 15 * 60 * 1000,
    },
    cyclesBeforeLongBreak: 4,
};

export class TimerEngineImpl implements ITimerEngine {
    private context: TimerContext;
    private settings: TimerSettings = { ...DEFAULT_SETTINGS };
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

        logger.info('TimerEngine instantiated');
    }

    public async initialize(): Promise<void> {
        const savedSettings = await TimerSettingsStorage.load();
        if (savedSettings) {
            this.settings = this.normalizeSettings(savedSettings);
        }

        logger.info('TimerEngine initializing persistence...');
        const savedState = await TimerStateStorage.load();

        if (!savedState) {
            logger.info('No saved state found. Starting fresh.');
            return;
        }

        logger.info(`Restoring saved state: ${savedState.currentMode}`);

        // Restore context basics
        this.context = { ...savedState };

        const now = Date.now();

        if (this.context.currentMode === TimerMode.IDLE) {
            // Nothing to do
        } else if (this.context.currentMode === TimerMode.PAUSED) {
            // Already paused, just ensure we have the right display
            logger.info('Restored in PAUSED state');
        } else {
            // Running state (FOCUS, BREAK, LONG_BREAK)
            if (this.context.targetTimestamp) {
                const delta = this.context.targetTimestamp - now;
                // delta is remaining time. Can be negative if expired.

                logger.info(`Restoring Active state. Remaining: ${delta}ms`);
                this.context.remainingTime = delta;
                this.context.elapsedTime = this.getDurationForMode(this.context.currentMode) - delta;

                // Always start ticking to keep updating UI (overtime or running)
                this.startTicking();

                if (delta > 0) {
                    // Still have time left, ensure alarm is scheduled
                    nativeTimer.scheduleAlarm(this.context.targetTimestamp, this.context.currentMode)
                        .catch(e => logger.error(`Failed to reschedule alarm on restore: ${e}`));
                } else {
                    // Already expired.
                    logger.info('Restored state is OVERTIME.');
                    // We don't trigger handleTimeElapsed here because we might have already notified user 
                    // when it originally happened (if app was alive) or we missed it.
                    // But strictly speaking, if we just opened and it's expired, we probably saw the notification/sound?
                    // Or if the app was killed, maybe not?
                    // For V0, let's just let it tick into negative numbers (UI shows > 25:00).
                }
            }
        }
        this.emitChange();
    }

    private persistState(): void {
        TimerStateStorage.save(this.context);
    }

    public getState(): TimerContext {
        return { ...this.context };
    }

    public getSettings(): TimerSettings {
        return {
            ...this.settings,
            durationsMs: { ...this.settings.durationsMs },
            reminderIntervalsMs: { ...this.settings.reminderIntervalsMs },
        };
    }

    public updateSettings(nextSettings: Partial<TimerSettings>): void {
        const merged: TimerSettings = this.normalizeSettings({
            ...this.settings,
            ...nextSettings,
            durationsMs: {
                ...this.settings.durationsMs,
                ...nextSettings.durationsMs,
            },
            reminderIntervalsMs: {
                ...this.settings.reminderIntervalsMs,
                ...nextSettings.reminderIntervalsMs,
            },
        });
        this.settings = merged;
        TimerSettingsStorage.save(merged);
        logger.info('Timer settings updated');

        this.realignCurrentModeAfterSettingsChange();
        this.emitChange();
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
        this.persistState();
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
        this.persistState();
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
        this.persistState();
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
        this.persistState();
    }

    public next(): void {
        const current = this.context.currentMode;

        // Cycle increment only happens when transitioning OUT of FOCUS
        if (current === TimerMode.FOCUS) {
            this.context.cycleCount++;
            logger.info(`Focus session completed (manual). Cycle count: ${this.context.cycleCount}`);

            const isLongBreak = this.context.cycleCount > 0
                && this.context.cycleCount % this.settings.cyclesBeforeLongBreak === 0;
            this.transitionTo(isLongBreak ? TimerMode.LONG_BREAK : TimerMode.BREAK);
        } else if (current === TimerMode.BREAK || current === TimerMode.LONG_BREAK) {
            this.transitionTo(TimerMode.FOCUS);
        } else {
            this.transitionTo(TimerMode.FOCUS);
        }

        this.startTicking();
        // next() calls transitionTo inside, which calls persistState()
        // But startTicking() doesn't.
        // Also transitionTo is called BEFORE startTicking inside next().
        // So state is persisted in transitionTo. 
        // We only persist transitions. Ticks are not persisted (too frequent).
        // That is fine.
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
        const duration = this.getDurationForMode(mode);

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
        this.persistState();
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
        const startTime = (this.context.targetTimestamp || now) - this.getDurationForMode(this.context.currentMode);

        // Elapsed time calculation: how much has passed since the mode started
        const elapsed = now - startTime;

        // Remaining time calculation
        const duration = this.getDurationForMode(this.context.currentMode);
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

        const modeDuration = this.getDurationForMode(mode);
        const reminderInterval = this.getReminderIntervalForMode(mode);

        const nextTime = Date.now() + reminderInterval;

        logger.info(`Scheduling next reminder for ${mode} in ${reminderInterval}ms (mode duration: ${modeDuration}ms)`);
        this.context.nextReminderTimestamp = nextTime;

        // Schedule next exact alarm
        nativeTimer.scheduleAlarm(nextTime, mode)
            .catch((e: any) => logger.error(`Failed to schedule reminder alarm: ${e}`));
    }

    private getDurationForMode(mode: TimerMode): number {
        if (mode === TimerMode.FOCUS) return this.settings.durationsMs.focus;
        if (mode === TimerMode.BREAK) return this.settings.durationsMs.break;
        if (mode === TimerMode.LONG_BREAK) return this.settings.durationsMs.longBreak;
        return 0;
    }

    private getReminderIntervalForMode(mode: TimerMode): number {
        if (mode === TimerMode.FOCUS) return this.settings.reminderIntervalsMs.focus;
        if (mode === TimerMode.BREAK) return this.settings.reminderIntervalsMs.break;
        if (mode === TimerMode.LONG_BREAK) return this.settings.reminderIntervalsMs.longBreak;
        return 0;
    }

    private normalizeSettings(settings: TimerSettings): TimerSettings {
        const minMs = 60 * 1000;
        const minCycles = 1;

        return {
            durationsMs: {
                focus: Math.max(settings.durationsMs.focus, minMs),
                break: Math.max(settings.durationsMs.break, minMs),
                longBreak: Math.max(settings.durationsMs.longBreak, minMs),
            },
            reminderIntervalsMs: {
                focus: Math.max(settings.reminderIntervalsMs.focus, minMs),
                break: Math.max(settings.reminderIntervalsMs.break, minMs),
                longBreak: Math.max(settings.reminderIntervalsMs.longBreak, minMs),
            },
            cyclesBeforeLongBreak: Math.max(settings.cyclesBeforeLongBreak, minCycles),
        };
    }

    private realignCurrentModeAfterSettingsChange(): void {
        const mode = this.context.currentMode;
        if (mode === TimerMode.IDLE) return;

        if (mode === TimerMode.PAUSED && this.context.previousMode) {
            const duration = this.getDurationForMode(this.context.previousMode);
            this.context.remainingTime = duration - this.context.elapsedTime;
            return;
        }

        const duration = this.getDurationForMode(mode);
        this.context.remainingTime = duration - this.context.elapsedTime;
        this.context.targetTimestamp = Date.now() + this.context.remainingTime;

        nativeTimer.scheduleAlarm(this.context.targetTimestamp, mode)
            .catch((e: any) => logger.error(`Failed to reschedule alarm after settings update: ${e}`));

        if (this.context.remainingTime <= 0) {
            this.scheduleNextReminder();
        }

        this.persistState();
    }
}
