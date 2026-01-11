/**
 * NativeTimerBridge defines the interface for native OS capabilities.
 * This is implemented by Native Modules on Android and iOS.
 */
export interface NativeTimerBridge {
    /**
     * Schedule an exact alarm/signal at the given timestamp.
     * @param timestamp Unix timestamp (ms) or system relative time
     * @param mode The mode context for the notification (Focus/Break/Long Break)
     */
    scheduleSignal(timestamp: number, mode: string): Promise<void>;

    /**
     * Cancel any pending signals.
     */
    cancelSignal(): Promise<void>;

    /**
     * Start the Foreground Service to prevent OS from killing the app process.
     * @param title Title for the persistent notification
     * @param message Message for the persistent notification
     */
    startForegroundService(title: string, message: string): Promise<void>;

    /**
     * Stop the Foreground Service.
     */
    stopForegroundService(): Promise<void>;

    /**
     * Play the soft ambient signal sound manually.
     */
    playSound(): Promise<void>;
}
