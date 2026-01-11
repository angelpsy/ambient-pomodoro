import { useTimerActions, useTimerState } from './TimerContext';

/**
 * useTimer hook provides a combined interface for UI components
 * to access both state and actions.
 */
export const useTimer = () => {
    const state = useTimerState();
    const actions = useTimerActions();

    return {
        ...state,
        start: () => actions.start(),
        pause: () => actions.pause(),
        resume: () => actions.resume(),
        stop: () => actions.stop(),
        next: () => actions.next(),
        switchToFocus: () => actions.switchToFocus(),
        switchToBreak: () => actions.switchToBreak(),
        switchToLongBreak: () => actions.switchToLongBreak(),
    };
};
