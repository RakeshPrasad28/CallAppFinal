package com.callappfinal.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactApplicationContext // Import only once
import com.facebook.react.bridge.ReactMethod
import android.app.Service
import android.util.Log

class CallService : Service() {

    companion object {
        const val TAG = "CallService"
    }

    override fun onCreate() {
        super.onCreate()

        // Create notification channel for Android O and above
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelId = "CALL_SERVICE_CHANNEL"
            val channelName = "Call Detection Service"
            val channel = NotificationChannel(
                channelId,
                channelName,
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)

            // Create the foreground notification
            val notification = NotificationCompat.Builder(this, channelId)
                .setContentTitle("Call Detection Service")
                .setContentText("Listening for incoming calls")
                .setSmallIcon(android.R.drawable.ic_menu_call)
                .build()

            // Start the service in the foreground
            startForeground(1, notification)
        } else {
            // For devices below Android O, we can still start in the background
            val notification = NotificationCompat.Builder(this)
                .setContentTitle("Call Detection Service")
                .setContentText("Listening for incoming calls")
                .setSmallIcon(android.R.drawable.ic_menu_call)
                .build()

            startForeground(1, notification)
        }

        // Log to verify service start
        Log.d(TAG, "CallService started")
    }

    override fun onBind(intent: Intent?): IBinder? {
        // This is a started service, not bound service.
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Continue the service if it's interrupted or killed
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        // Clean up or stop the service
        Log.d(TAG, "CallService destroyed")
    }
}
