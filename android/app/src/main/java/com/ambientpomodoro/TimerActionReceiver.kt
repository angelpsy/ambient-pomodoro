package com.ambientpomodoro

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class TimerActionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Log.i("TimerActionReceiver", "Action received: ${intent.action}")
        
        if (intent.action == NotificationHelper.ACTION_NEXT) {
            // Clear notification immediately
            NotificationHelper.clearSignalNotification(context)

            // Send event to JS
            TimerNativeModule.sendEventToJS("onTimerNext", null)
            
            // Bring app to foreground (optional, but requested by user's expectation of mode change)
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            launchIntent?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(launchIntent)
        }
    }
}
