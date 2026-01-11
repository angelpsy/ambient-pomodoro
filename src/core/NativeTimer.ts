import { NativeModules } from 'react-native';
import { NativeTimerBridge } from './NativeTimerBridge';

const { TimerNativeBridge } = NativeModules;

/**
 * Singleton instance of the Native Timer Bridge.
 * Ensures the JS layer has a typed interface to communicate with Android/iOS.
 */
export const nativeTimer: NativeTimerBridge = {
    scheduleSignal: (timestamp, mode) => TimerNativeBridge.scheduleSignal(timestamp, mode),
    cancelSignal: () => TimerNativeBridge.cancelSignal(),
    startForegroundService: (title, message) => TimerNativeBridge.startForegroundService(title, message),
    stopForegroundService: () => TimerNativeBridge.stopForegroundService(),
    playSound: () => TimerNativeBridge.playSound(),
};
