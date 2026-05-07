import { TimerContext } from './types';
import { nativeFileStorage } from './NativeFileStorage';
import { logger } from './LoggerImpl';

const STORAGE_FILE = 'timer_state.json';

export class TimerStateStorage {
    public static async save(context: TimerContext): Promise<void> {
        try {
            const data = JSON.stringify(context);
            await nativeFileStorage.writeFile(STORAGE_FILE, data);
            // Debug log? Maybe too noisy for every second, but okay for state changes
        } catch (e) {
            logger.error(`Failed to save timer state: ${e}`);
        }
    }

    public static async load(): Promise<TimerContext | null> {
        try {
            const content = await nativeFileStorage.readFile(STORAGE_FILE);
            if (!content) return null;

            const data = JSON.parse(content);
            return data as TimerContext;
        } catch (e) {
            logger.error(`Failed to load timer state: ${e}`);
            return null;
        }
    }

    public static async clear(): Promise<void> {
        try {
            await nativeFileStorage.deleteFile(STORAGE_FILE);
        } catch (e) {
            logger.error(`Failed to clear timer state: ${e}`);
        }
    }
}
