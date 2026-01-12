package com.ambientpomodoro

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class NotificationHelper(private val context: Context) {
    companion object {
        const val CHANNEL_ID_SIGNALS = "focus_signals_v2"
        const val CHANNEL_NAME_SIGNALS = "Focus Signals"
        const val CHANNEL_DESC_SIGNALS = "Notifications for focus and break transitions"
        const val NOTIFICATION_ID_SIGNAL = 1001
        const val ACTION_NEXT = "com.ambientpomodoro.ACTION_NEXT"

        fun clearSignalNotification(context: Context) {
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as android.app.NotificationManager
            notificationManager.cancel(NOTIFICATION_ID_SIGNAL)
        }

        fun showSignalNotification(context: Context, mode: String) {
            val title = when (mode) {
                "FOCUS" -> "Focus Session Ended"
                "BREAK" -> "Break Ended"
                "LONG_BREAK" -> "Long Break Ended"
                else -> "Timer Ended"
            }
            val text = "Tap to open or button to switch mode."

            // Intent to open the app
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            val contentIntent = PendingIntent.getActivity(
                context, 
                0, 
                launchIntent, 
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // Intent for the "NEXT" action button
            val nextIntent = Intent(context, TimerActionReceiver::class.java).apply {
                action = ACTION_NEXT
            }
            val nextPendingIntent = PendingIntent.getBroadcast(
                context,
                1,
                nextIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val builder = NotificationCompat.Builder(context, CHANNEL_ID_SIGNALS)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(text)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC) // SHOW ON LOCK SCREEN
                .setContentIntent(contentIntent)
                .addAction(android.R.drawable.ic_media_next, "Next Mode", nextPendingIntent)
                .setAutoCancel(true)
                .setSound(android.media.RingtoneManager.getDefaultUri(android.media.RingtoneManager.TYPE_NOTIFICATION))
                .setDefaults(NotificationCompat.DEFAULT_VIBRATE or NotificationCompat.DEFAULT_LIGHTS)

            with(NotificationManagerCompat.from(context)) {
                cancel(NOTIFICATION_ID_SIGNAL)
                notify(NOTIFICATION_ID_SIGNAL, builder.build())
            }
        }
    }

    fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importance = NotificationManager.IMPORTANCE_HIGH // High for sound/heads-up
            val channel = NotificationChannel(CHANNEL_ID_SIGNALS, CHANNEL_NAME_SIGNALS, importance).apply {
                description = CHANNEL_DESC_SIGNALS
            }
            
            val notificationManager: NotificationManager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
}
