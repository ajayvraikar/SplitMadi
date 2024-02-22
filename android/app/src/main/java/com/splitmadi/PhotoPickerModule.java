package com.splitmadi;

import android.annotation.SuppressLint;

import androidx.annotation.NonNull;
import android.content.Context;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import android.database.Cursor;
import android.provider.MediaStore;
import com.facebook.react.bridge.WritableMap;
import android.os.AsyncTask;
import android.content.ContentResolver;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.util.Log;
import android.provider.MediaStore.Images.Media;
import androidx.core.content.ContextCompat;
import java.util.ArrayList;
import android.net.Uri;
import java.io.FileOutputStream;
import java.io.IOException;

import android.Manifest;
import android.content.pm.PackageManager;
import android.media.ThumbnailUtils;
import java.io.ByteArrayOutputStream;
import android.util.Base64;



public class PhotoPickerModule extends ReactContextBaseJavaModule {
    String moduleName = "PhotoPickerModule";
    public PhotoPickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PhotoPickerModule";
    }

    @ReactMethod
    public void getAllPhotos(int pageNumber, int pageSize, Callback callback) {
        int offset = (pageNumber - 1) * pageSize;

        Context context = getReactApplicationContext();

        ArrayList<String> photoPaths = new ArrayList<>();
         ArrayList<String> thumbnailBase64List = new ArrayList<>();
        ArrayList<String> mimeTypes = new ArrayList<>();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      Log.d(moduleName, "After IF Permkission ");
      System.out.println("After IF Permkission ");
    }

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
      if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_MEDIA_IMAGES) !=
        PackageManager.PERMISSION_GRANTED) {
        callback.invoke("Permission Not Found", photoPaths);
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        // requestPermissions.launch(arrayOf(Manifest.permission.READ_MEDIA_IMAGES, Manifest.permission.READ_MEDIA_VIDEO));
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_MEDIA_IMAGES) !=
          PackageManager.PERMISSION_GRANTED) {
          callback.invoke("Permission Not Found", photoPaths);
        }
      } else {
        Log.d(moduleName, "Device doesn't require runtime permission check.");
      }

    } else {
      Log.d(moduleName, "Device doesn't require runtime permission check.");
    }

        String[] projection = {
                MediaStore.Images.Media.DATA,
                MediaStore.Images.Media.MIME_TYPE
        };

        ContentResolver contentResolver = context.getContentResolver();
        Uri uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;

        Cursor cursor = null;
        try {
            cursor = contentResolver.query(uri, projection, null, null, null);
            int totalCount = cursor.getCount();
            
            if (offset > totalCount && pageNumber == 1) {
                offset = 0; // Adjust offset to the last available photo
            }
            if (cursor != null) {
                if (cursor.moveToPosition(offset)) {
                int dataIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                int mimeTypeIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.MIME_TYPE);

                int count = 0;
                do {
                    String path = cursor.getString(dataIndex);
                    String mimeType = cursor.getString(mimeTypeIndex);

                    // Generate thumbnail
                    Bitmap thumbnail = ThumbnailUtils.extractThumbnail(BitmapFactory.decodeFile(path), 50, 50);

                    // Convert thumbnail to Base64
                    String thumbnailBase64 = convertBitmapToBase64(thumbnail);

                    photoPaths.add(path);
                    thumbnailBase64List.add(thumbnailBase64);
                    mimeTypes.add(mimeType);

                    count++;
                    if (count >= pageSize) {
                        break; // Reached the page size limit
                    }
                } while (cursor.moveToNext());

                if (photoPaths.isEmpty()) {
                    Log.d(moduleName, "No photos available");
                } else {
                    Log.d(moduleName, "Fetched Photos: " + photoPaths);
                }
            } else {
                Log.d(moduleName, "No more photos available");
            }

                if (photoPaths.isEmpty()) {
                    Log.d(moduleName, "No photos available");
                } else {
                    Log.d(moduleName, "Fetched Photos: " + photoPaths);
                }
            } else {
                Log.e(moduleName, "Cursor is null while fetching photos");
            }
        } catch (Exception e) {
            Log.e(moduleName, "Error fetching photos", e);
        } finally {
            if (cursor != null && !cursor.isClosed()) {
                cursor.close();
            }
        }

        try {
            WritableArray writableArray = Arguments.createArray();
            for (int i = 0; i < photoPaths.size(); i++) {
                WritableMap photoMap = Arguments.createMap();

                photoMap.putString("path", photoPaths.get(i));
                photoMap.putString("thumbnailBase64", thumbnailBase64List.get(i));
                photoMap.putString("mimeType", mimeTypes.get(i));

                writableArray.pushMap(photoMap);
            }

            callback.invoke(null, writableArray);

        } catch (Exception e) {
            callback.invoke(e.getMessage(), null);
        }
    }

    private String convertBitmapToBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        return Base64.encodeToString(byteArray, Base64.DEFAULT);
    }
}
