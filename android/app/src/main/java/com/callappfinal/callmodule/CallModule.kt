package com.callappfinal.callmodule

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.telecom.TelecomManager
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class CallModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        var reactAppContext: ReactApplicationContext? = null

        fun sendEvent(eventName: String, params: String) {
            reactAppContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, params)
        }
    }

    init {
        reactAppContext = reactContext
    }

    override fun getName(): String {
        return "CallModule"
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun init() {
        Log.d("CallModule", "🛠️ CallModule.init() called")
    }

    @ReactMethod
    fun askToBeDefaultDialer() {
        val telecomManager = reactContext.getSystemService(Context.TELECOM_SERVICE) as TelecomManager
        val intent = Intent(TelecomManager.ACTION_CHANGE_DEFAULT_DIALER)
        intent.putExtra(TelecomManager.EXTRA_CHANGE_DEFAULT_DIALER_PACKAGE_NAME, reactContext.packageName)

        val currentActivity: Activity? = currentActivity
        if (currentActivity != null) {
            currentActivity.startActivity(intent)
        } else {
            Log.e("CallModule", "❌ Current activity is null, cannot launch dialer intent")
        }
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        // No-op
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // No-op
    }
}
