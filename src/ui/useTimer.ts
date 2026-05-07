import { useTimerActions, useTimerSettings, useTimerState } from './TimerContext';
import { TimerSettings } from '../core/types';

/**
 * useTimer hook provides a combined interface for UI components
 * to access both state and actions.
 */
export const useTimer = () => {
    const state = useTimerState();
    const actions = useTimerActions();
    const settings = useTimerSettings();

    return {
        ...state,
        settings,
        start: () => actions.start(),
        pause: () => actions.pause(),
        resume: () => actions.resume(),
        stop: () => actions.stop(),
        next: () => actions.next(),
        switchToFocus: () => actions.switchToFocus(),
        switchToBreak: () => actions.switchToBreak(),
        switchToLongBreak: () => actions.switchToLongBreak(),
        updateSettings: (nextSettings: Partial<TimerSettings>) => actions.updateSettings(nextSettings),
    };
};
