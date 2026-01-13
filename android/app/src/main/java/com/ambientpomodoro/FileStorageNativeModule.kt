package com.ambientpomodoro

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.io.File
import android.util.Log

class FileStorageNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val TAG = "FileStorageNativeModule"

    override fun getName(): String {
        return "FileStorageNativeModule"
    }

    private fun getFile(filename: String): File {
        val file = File(reactApplicationContext.filesDir, filename)
        if (!file.canonicalPath.startsWith(reactApplicationContext.filesDir.canonicalPath)) {
            throw SecurityException("Invalid filename: $filename. Path traversal detected.")
        }
        return file
    }

    @ReactMethod
    fun writeFile(filename: String, content: String, promise: Promise) {
        try {
            Log.d(TAG, "Writing file: $filename, length: ${content.length}")
            getFile(filename).writeText(content)
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to write file: $filename", e)
            promise.reject("E_FILE_WRITE", "Failed to write file: $filename", e)
        }
    }

    @ReactMethod
    fun readFile(filename: String, promise: Promise) {
        try {
            val file = getFile(filename)
            if (!file.exists()) {
                Log.d(TAG, "File does not exist: $filename")
                promise.resolve(null) // Return null if file doesn't exist
                return
            }
            val content = file.readText()
            Log.d(TAG, "Read file: $filename, length: ${content.length}")
            promise.resolve(content)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to read file: $filename", e)
            promise.reject("E_FILE_READ", "Failed to read file: $filename", e)
        }
    }

    @ReactMethod
    fun deleteFile(filename: String, promise: Promise) {
        try {
            val file = getFile(filename)
            if (file.exists()) {
                file.delete()
                Log.d(TAG, "Deleted file: $filename")
            }
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to delete file: $filename", e)
            promise.reject("E_FILE_DELETE", "Failed to delete file: $filename", e)
        }
    }

}
