package com.ambientpomodoro

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

class TimerNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        instance = this
    }

    companion object {
        private var instance: TimerNativeModule? = null

        fun sendEventToJS(eventName: String, params: WritableMap?) {
            instance?.reactApplicationContext
                ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, params)
        }
    }

    override fun getName(): String {
        return "TimerNativeModule"
    }

    @ReactMethod
    fun scheduleAlarm(timestamp: Double, mode: String, promise: Promise) {
        val context = reactApplicationContext
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        
        val intent = Intent(context, TimerReceiver::class.java).apply {
            action = "com.ambientpomodoro.ALARM_ACTION"
            putExtra("MODE", mode)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Use setExactAndAllowWhileIdle for reliable background triggers
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    timestamp.toLong(),
                    pendingIntent
                )
            } else {
                alarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    timestamp.toLong(),
                    pendingIntent
                )
            }
            Log.i("TimerNativeModule", "Alarm scheduled for $mode at $timestamp")
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e("TimerNativeModule", "Failed to schedule alarm", e)
            promise.reject("ALARM_ERROR", e.message)
        }
    }

    @ReactMethod
    fun cancelAlarm(promise: Promise) {
        try {
            val context = reactApplicationContext
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            
            val intent = Intent(context, TimerReceiver::class.java).apply {
                action = "com.ambientpomodoro.ALARM_ACTION"
            }

            val pendingIntent = PendingIntent.getBroadcast(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            alarmManager.cancel(pendingIntent)
            Log.i("TimerNativeModule", "Pending alarms cancelled")
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("CANCEL_ERROR", e.message)
        }
    }

    @ReactMethod
    fun clearSignalNotification(promise: Promise) {
        try {
            NotificationHelper.clearSignalNotification(reactApplicationContext)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("CLEAR_ERROR", e.message)
        }
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
        try {
            val notification = android.media.RingtoneManager.getDefaultUri(android.media.RingtoneManager.TYPE_NOTIFICATION)
            val r = android.media.RingtoneManager.getRingtone(reactApplicationContext, notification)
            r.play()
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("SOUND_ERROR", e.message)
        }
    }
}
