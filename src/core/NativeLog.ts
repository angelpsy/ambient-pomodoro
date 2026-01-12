import { NativeModules } from 'react-native';

const { LogNativeModule } = NativeModules;

if (!LogNativeModule) {
    console.error('[NativeLog] LogNativeModule NOT DETECTED! A full native build is required.');
}

export interface LogNativeBridge {
    saveLogs(logsJson: string): Promise<void>;
    loadLogs(): Promise<string>;
    clearLogs(): Promise<void>;
}

export const nativeLog: LogNativeBridge = {
    saveLogs(logsJson: string): Promise<void> {
        return LogNativeModule?.saveLogs(logsJson) || Promise.resolve();
    },
    loadLogs(): Promise<string> {
        return LogNativeModule?.loadLogs() || Promise.resolve('[]');
    },
    clearLogs(): Promise<void> {
        return LogNativeModule?.clearLogs() || Promise.resolve();
    }
};
