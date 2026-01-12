import { NativeModules } from 'react-native';
import { NativeTimerBridge } from './NativeTimerBridge';

const { TimerNativeModule } = NativeModules;

/**
 * Singleton instance of the Native Timer Bridge.
 * Ensures the JS layer has a typed interface to communicate with Android/iOS.
 */
export const nativeTimer: NativeTimerBridge = {
    scheduleSignal: (timestamp, mode) => {
        return TimerNativeModule?.scheduleAlarm(timestamp, mode) || Promise.resolve();
    },
    scheduleAlarm(timestamp: number, mode: string): Promise<void> {
        return TimerNativeModule?.scheduleAlarm(timestamp, mode) || Promise.resolve();
    },
    cancelAlarm(): Promise<void> {
        return TimerNativeModule?.cancelAlarm() || Promise.resolve();
    },
    clearSignalNotification(): Promise<void> {
        return TimerNativeModule?.clearSignalNotification() || Promise.resolve();
    },
    cancelSignal: () => {
        return TimerNativeModule?.cancelAlarm() || Promise.resolve();
    },
    startForegroundService: (title, message) => {
        return TimerNativeModule?.startForegroundService(title, message) || Promise.resolve();
    },
    stopForegroundService: () => {
        return TimerNativeModule?.stopForegroundService() || Promise.resolve();
    },
    playSound: () => {
        return TimerNativeModule?.playSound() || Promise.resolve();
    },
};
