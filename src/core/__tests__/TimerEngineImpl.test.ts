import { TimerEngineImpl } from '../TimerEngineImpl';
import { TimerMode } from '../types';

describe('TimerEngineImpl', () => {
    let engine: TimerEngineImpl;

    beforeEach(() => {
        engine = new TimerEngineImpl();
        jest.useFakeTimers();
    });

    afterEach(() => {
        engine.stop();
        jest.clearAllTimers();
    });

    test('should initialize in IDLE mode', () => {
        const state = engine.getState();
        expect(state.currentMode).toBe(TimerMode.IDLE);
        expect(state.elapsedTime).toBe(0);
        expect(state.cycleCount).toBe(0);
    });

    test('start() should transition to FOCUS', () => {
        engine.start();
        const state = engine.getState();
        expect(state.currentMode).toBe(TimerMode.FOCUS);
        expect(state.remainingTime).toBe(25 * 60 * 1000);
    });

    test('should tick and update time', () => {
        engine.start();
        jest.advanceTimersByTime(5000);
        const state = engine.getState();
        expect(state.remainingTime).toBe((25 * 60 - 5) * 1000);
        expect(state.elapsedTime).toBe(5 * 1000);
    });

    test('pause() and resume() should preserve state', () => {
        engine.start();
        jest.advanceTimersByTime(10000);
        engine.pause();

        let state = engine.getState();
        expect(state.currentMode).toBe(TimerMode.PAUSED);
        const savedRemaining = state.remainingTime;

        jest.advanceTimersByTime(5000); // Time shouldn't pass while paused
        expect(engine.getState().remainingTime).toBe(savedRemaining);

        engine.resume();
        state = engine.getState();
        expect(state.currentMode).toBe(TimerMode.FOCUS);
        expect(state.remainingTime).toBe(savedRemaining);

        jest.advanceTimersByTime(1000);
        expect(engine.getState().remainingTime).toBe(savedRemaining - 1000);
    });

    test('TIME_ELAPSED in FOCUS should NOT increment cycleCount automatically', () => {
        engine.start();
        // Advance to 0 second
        jest.advanceTimersByTime(25 * 60 * 1000);
        const state = engine.getState();
        expect(state.cycleCount).toBe(0); // Should still be 0 as per new rules
        expect(state.remainingTime).toBe(0);
    });

    test('overtime: timer should continue counting up', () => {
        engine.start();
        jest.advanceTimersByTime(25 * 60 * 1000 + 5000);
        const state = engine.getState();
        expect(state.remainingTime).toBe(-5000);
        expect(state.elapsedTime).toBe(25 * 60 * 1000 + 5000); // Counts up
    });

    test('next() from FOCUS should increment cycleCount manually', () => {
        engine.start();
        jest.advanceTimersByTime(25 * 60 * 1000);
        engine.next();
        expect(engine.getState().cycleCount).toBe(1); // Increment on transition
        expect(engine.getState().currentMode).toBe(TimerMode.BREAK);
    });

    test('manual switch from FOCUS should increment cycleCount', () => {
        engine.start();
        jest.advanceTimersByTime(10 * 60 * 1000);
        engine.switchToBreak();
        expect(engine.getState().cycleCount).toBe(1);
        expect(engine.getState().currentMode).toBe(TimerMode.BREAK);
    });

    test('next() after 4 focus sessions should suggest LONG_BREAK', () => {
        // 1st Cycle
        engine.start();
        jest.advanceTimersByTime(25 * 60 * 1000);
        engine.next(); // to BREAK
        engine.next(); // back to FOCUS

        // 2nd Cycle
        jest.advanceTimersByTime(25 * 60 * 1000);
        engine.next(); // to BREAK
        engine.next(); // back to FOCUS

        // 3rd Cycle
        jest.advanceTimersByTime(25 * 60 * 1000);
        engine.next(); // to BREAK
        engine.next(); // back to FOCUS

        // 4th Cycle
        jest.advanceTimersByTime(25 * 60 * 1000);
        engine.next(); // This should go to LONG_BREAK because cycleCount is 4

        expect(engine.getState().cycleCount).toBe(4);
        expect(engine.getState().currentMode).toBe(TimerMode.LONG_BREAK);
    });

    test('stop() should reset everything', () => {
        engine.start();
        jest.advanceTimersByTime(10000);
        engine.stop();
        const state = engine.getState();
        expect(state.currentMode).toBe(TimerMode.IDLE);
        expect(state.elapsedTime).toBe(0);
        expect(state.cycleCount).toBe(0);
    });

    test('updateSettings() should affect next transition duration', () => {
        engine.updateSettings({
            durationsMs: {
                focus: 10 * 60 * 1000,
                break: 3 * 60 * 1000,
                longBreak: 20 * 60 * 1000,
            },
        });

        engine.start();
        expect(engine.getState().remainingTime).toBe(10 * 60 * 1000);
        engine.next();
        expect(engine.getState().remainingTime).toBe(3 * 60 * 1000);
    });

    test('updateSettings() should apply custom cycle threshold for long break', () => {
        engine.updateSettings({ cyclesBeforeLongBreak: 2 });
        engine.start();
        engine.next(); // cycle 1 => BREAK
        engine.next(); // FOCUS
        engine.next(); // cycle 2 => LONG_BREAK

        expect(engine.getState().currentMode).toBe(TimerMode.LONG_BREAK);
    });
});
