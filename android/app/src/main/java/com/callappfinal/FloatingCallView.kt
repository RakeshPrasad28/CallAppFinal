package com.callappfinal.callmodule

import android.content.ContentResolver
import android.content.Context
import android.database.Cursor
import android.graphics.PixelFormat
import android.provider.CallLog
import android.provider.ContactsContract
import android.telephony.PhoneNumberUtils
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import android.widget.TextView
import com.callappfinal.R
import java.text.SimpleDateFormat
import java.util.*

object FloatingCallView {

    private var view: View? = null
    private var isVisible = false

    fun show(context: Context, phoneNumber: String) {
        if (isVisible) return

        val inflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        view = inflater.inflate(R.layout.floating_call_view, null)

        val numberText: TextView? = view?.findViewById(R.id.callerNumber)
        val lastCallText: TextView? = view?.findViewById(R.id.lastCallTime) // ⬅️ new line

        // Fetch contact name if available
        val contactName = getContactName(context, phoneNumber)
        if (contactName != null) {
            numberText?.text = contactName
        } else {
            numberText?.text = "📞 $phoneNumber"
        }

        // ⬇️ Set last call info
        val lastCall = getLastCallTime(context, phoneNumber)
        lastCallText?.text = lastCall ?: "No recent call info"

        val closeIcon = view?.findViewById<ImageView>(R.id.closeIcon)
        closeIcon?.setOnClickListener {
            hide(context)
        }

        val heightInDp = 144
        val scale = context.resources.displayMetrics.density
        val heightInPx = (heightInDp * scale + 0.5f).toInt()

        val layoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            heightInPx,
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        )

        layoutParams.gravity = Gravity.CENTER
        layoutParams.y = 0

        val wm = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        wm.addView(view, layoutParams)

        isVisible = true
    }

    fun hide(context: Context) {
        if (!isVisible || view == null) return
        val wm = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        wm.removeView(view)
        view = null
        isVisible = false
    }

    fun getContactName(context: Context, phoneNumber: String): String? {
        val normalizedNumber = PhoneNumberUtils.normalizeNumber(phoneNumber)
        val resolver: ContentResolver = context.contentResolver
        val uri = ContactsContract.CommonDataKinds.Phone.CONTENT_URI
        val projection = arrayOf(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)

        val cursor: Cursor? = resolver.query(uri, projection,
            "${ContactsContract.CommonDataKinds.Phone.NUMBER} = ?", arrayOf(normalizedNumber), null)

        var contactName: String? = null
        if (cursor != null && cursor.moveToFirst()) {
            contactName = cursor.getString(cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME))
            cursor.close()
        }

        return contactName
    }

    // ⬇️ New helper function for last call time
    fun getLastCallTime(context: Context, phoneNumber: String): String? {
        val normalizedNumber = PhoneNumberUtils.normalizeNumber(phoneNumber)
        val resolver: ContentResolver = context.contentResolver

        val projection = arrayOf(CallLog.Calls.DATE)
        val selection = "${CallLog.Calls.NUMBER} = ?"
        val selectionArgs = arrayOf(normalizedNumber)
        val sortOrder = "${CallLog.Calls.DATE} DESC"

        val cursor = resolver.query(
            CallLog.Calls.CONTENT_URI,
            projection,
            selection,
            selectionArgs,
            sortOrder
        )

        var lastCallTime: String? = null
        if (cursor != null && cursor.moveToFirst()) {
            val dateMillis = cursor.getLong(cursor.getColumnIndex(CallLog.Calls.DATE))
            val date = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()).format(Date(dateMillis))
            lastCallTime = "📅 Last Call: $date"
            cursor.close()
        }

        return lastCallTime
    }
}
