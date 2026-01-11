package com.ambientpomodoro

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class TimerNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "TimerNativeBridge"
    }

    @ReactMethod
    fun scheduleSignal(timestamp: Double, mode: String, promise: Promise) {
        // TODO: Implement AlarmManager scheduling
        promise.resolve(null)
    }

    @ReactMethod
    fun cancelSignal(promise: Promise) {
        // TODO: Implement AlarmManager cancellation
        promise.resolve(null)
    }

    @ReactMethod
    fun startForegroundService(title: String, message: String, promise: Promise) {
        // TODO: Implement Foreground Service start
        promise.resolve(null)
    }

    @ReactMethod
    fun stopForegroundService(promise: Promise) {
        // TODO: Implement Foreground Service stop
        promise.resolve(null)
    }

    @ReactMethod
    fun playSound(promise: Promise) {
        // TODO: Implement MediaPlayer signal
        promise.resolve(null)
    }
}
