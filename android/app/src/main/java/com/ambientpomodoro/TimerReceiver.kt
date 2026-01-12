package com.ambientpomodoro

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Arguments

class TimerReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == "com.ambientpomodoro.ALARM_ACTION") {
            val mode = intent.getStringExtra("MODE") ?: "UNKNOWN"
            Log.i("TimerReceiver", "Alarm received for mode: $mode")
            
            // Wake screen
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as android.os.PowerManager
            val wakeLock = powerManager.newWakeLock(
                android.os.PowerManager.SCREEN_BRIGHT_WAKE_LOCK or android.os.PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "AmbientPomodoro:TimerWakeLock"
            )
            wakeLock.acquire(3000) // Wake for 3 seconds

            // Trigger notification through helper
            NotificationHelper.showSignalNotification(context, mode)

            // Notify JS that alarm fired
            TimerNativeModule.sendEventToJS("onAlarmFired", Arguments.createMap().apply {
                putString("mode", mode)
            })
        }
    }
}
