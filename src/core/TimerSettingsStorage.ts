import { nativeFileStorage } from './NativeFileStorage';
import { logger } from './LoggerImpl';
import { TimerSettings } from './types';

const STORAGE_FILE = 'timer_settings.json';

export class TimerSettingsStorage {
    public static async save(settings: TimerSettings): Promise<void> {
        try {
            await nativeFileStorage.writeFile(STORAGE_FILE, JSON.stringify(settings));
        } catch (e) {
            logger.error(`Failed to save timer settings: ${e}`);
        }
    }

    public static async load(): Promise<TimerSettings | null> {
        try {
            const content = await nativeFileStorage.readFile(STORAGE_FILE);
            if (!content) return null;

            return JSON.parse(content) as TimerSettings;
        } catch (e) {
            logger.error(`Failed to load timer settings: ${e}`);
            return null;
        }
    }
}
