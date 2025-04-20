package com.callappfinal.callmodule

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.TelephonyManager
import android.util.Log

class CallReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE)
        val number = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER)

        if (state == TelephonyManager.EXTRA_STATE_RINGING && number != null) {
            Log.d("CallReceiver", "📞 Incoming Call: $number")

            // 🔥 This sends the data to JS via the static method we added in CallModule
            CallModule.sendEvent("IncomingCall", number)
        }
    }
}
