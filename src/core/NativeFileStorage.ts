import { NativeModules } from 'react-native';

const { FileStorageNativeModule } = NativeModules;

if (!FileStorageNativeModule) {
    console.warn('[NativeFileStorage] FileStorageNativeModule NOT DETECTED! Persistence will not work until rebuild.');
}

export interface FileStorageBridge {
    writeFile(filename: string, content: string): Promise<void>;
    readFile(filename: string): Promise<string | null>;
    deleteFile(filename: string): Promise<void>;
}

export const nativeFileStorage: FileStorageBridge = {
    writeFile(filename: string, content: string): Promise<void> {
        return FileStorageNativeModule?.writeFile(filename, content) || Promise.resolve();
    },
    readFile(filename: string): Promise<string | null> {
        return FileStorageNativeModule?.readFile(filename) || Promise.resolve(null);
    },
    deleteFile(filename: string): Promise<void> {
        return FileStorageNativeModule?.deleteFile(filename) || Promise.resolve();
    }
};
