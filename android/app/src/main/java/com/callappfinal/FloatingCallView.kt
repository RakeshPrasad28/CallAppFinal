package com.callappfinal.callmodule

import android.content.ContentResolver
import android.content.Context
import android.database.Cursor
import android.graphics.PixelFormat
import android.provider.ContactsContract
import android.telephony.PhoneNumberUtils
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import android.widget.TextView
import com.callappfinal.R

object FloatingCallView {

    private var view: View? = null
    private var isVisible = false

    fun show(context: Context, phoneNumber: String) {
        if (isVisible) return

        val inflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        view = inflater.inflate(R.layout.floating_call_view, null)

        val numberText: TextView? = view?.findViewById(R.id.callerNumber)
        
        // Fetch contact name if available
        val contactName = getContactName(context, phoneNumber)
        if (contactName != null) {
            numberText?.text = contactName
        } else {
            numberText?.text = "📞 $phoneNumber"  // Default if no contact found
        }

        val closeIcon = view?.findViewById<ImageView>(R.id.closeIcon)
        closeIcon?.setOnClickListener {
            hide(context)
        }

        // Convert 72dp to pixels
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

        // Centering the modal vertically
        layoutParams.gravity = Gravity.CENTER // This will center the modal in the screen
        layoutParams.y = 0  // Optionally adjust if you need to fine-tune the position

        val wm = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        wm.addView(view, layoutParams)

        isVisible = true

        // Optional: Auto-remove after 10 sec
        view?.postDelayed({ hide(context) }, 10000)
    }

    fun hide(context: Context) {
        if (!isVisible || view == null) return
        val wm = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        wm.removeView(view)
        view = null
        isVisible = false
    }

    // Function to get the contact name from the phone number
    fun getContactName(context: Context, phoneNumber: String): String? {
        // Clean up the phone number (strip special characters, etc.)
        val normalizedNumber = PhoneNumberUtils.normalizeNumber(phoneNumber)
    
        val resolver: ContentResolver = context.contentResolver
        val uri = ContactsContract.CommonDataKinds.Phone.CONTENT_URI
        val projection = arrayOf(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)

        // Query the contacts database for a matching phone number
        val cursor: Cursor? = resolver.query(uri, projection,
            "${ContactsContract.CommonDataKinds.Phone.NUMBER} = ?", arrayOf(normalizedNumber), null)

        var contactName: String? = null
        if (cursor != null && cursor.moveToFirst()) {
            // If the number matches, retrieve the contact name
            contactName = cursor.getString(cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME))
            cursor.close()
        }

        return contactName
    }
}
