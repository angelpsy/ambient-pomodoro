package com.ambientpomodoro

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.io.File
import android.util.Log

class LogNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val TAG = "LogNativeModule"

    override fun getName(): String {
        return "LogNativeModule"
    }

    private val logFile: File by lazy {
        File(reactApplicationContext.filesDir, "logs.txt")
    }

    @ReactMethod
    fun saveLogs(logsJson: String, promise: Promise) {
        try {
            Log.d(TAG, "Saving logs, length: ${logsJson.length}")
            logFile.writeText(logsJson)
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to save logs", e)
            promise.reject("E_LOG_SAVE", "Failed to save logs to file", e)
        }
    }

    @ReactMethod
    fun loadLogs(promise: Promise) {
        try {
            if (!logFile.exists()) {
                Log.d(TAG, "Log file does not exist")
                promise.resolve("[]")
                return
            }
            val content = logFile.readText()
            Log.d(TAG, "Loaded logs, length: ${content.length}")
            promise.resolve(content)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to load logs", e)
            promise.reject("E_LOG_LOAD", "Failed to load logs from file", e)
        }
    }

    @ReactMethod
    fun clearLogs(promise: Promise) {
        try {
            if (logFile.exists()) {
                logFile.delete()
            }
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("E_LOG_CLEAR", "Failed to clear log file", e)
        }
    }
}
