package com.ambientpomodoro

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build

class NotificationHelper(private val context: Context) {
    companion object {
        const val CHANNEL_ID_SIGNALS = "focus_signals"
        const val CHANNEL_NAME_SIGNALS = "Focus Signals"
        const val CHANNEL_DESC_SIGNALS = "Notifications for focus and break transitions"
    }

    fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importance = NotificationManager.IMPORTANCE_LOW
            val channel = NotificationChannel(CHANNEL_ID_SIGNALS, CHANNEL_NAME_SIGNALS, importance).apply {
                description = CHANNEL_DESC_SIGNALS
                // We'll configure sound later once we have the asset
            }
            
            val notificationManager: NotificationManager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
}
