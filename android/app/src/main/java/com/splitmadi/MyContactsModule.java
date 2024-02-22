package com.splitmadi;

import android.annotation.SuppressLint;
import android.provider.Settings;

import androidx.annotation.NonNull;
import android.content.Context;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import android.database.Cursor;
import android.provider.ContactsContract;
import com.facebook.react.bridge.Promise;
import android.content.ContentResolver;
import com.facebook.react.bridge.WritableMap;
import android.os.AsyncTask;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import android.net.Uri;
import android.media.AudioAttributes;
import android.graphics.BitmapFactory;
import android.content.SharedPreferences;
import android.media.RingtoneManager;
import android.content.Intent;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ActivityEventListener;
import android.app.Activity;

import android.content.pm.PackageManager;
import android.database.Cursor;
import android.util.Log;
import android.provider.MediaStore;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import java.util.ArrayList;
import android.Manifest;
import com.facebook.react.bridge.Callback;
import android.content.ContentUris;
import java.util.List;
import android.webkit.MimeTypeMap;
import java.io.File;
import android.os.Environment;
import java.io.FileFilter;
import java.util.Stack;

public class MyContactsModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;
    MyContactsModule(ReactApplicationContext context) {
       super(context);
        reactContext = context;
        reactContext.addActivityEventListener(activityEventListener);
        // createNotificationChannel(reactContext);
    }
    // pavana
    private static final String CHANNEL_ID = "sample_channel";
    private static final int NOTIFICATION_ID = 1;


    public class PhotoData {
    private String imagePath;
    private String thumbnailPath;
    private String mimeType;

    public PhotoData(String imagePath, String thumbnailPath, String mimeType) {
        this.imagePath = imagePath;
        this.thumbnailPath = thumbnailPath;
        this.mimeType = mimeType;
    }

    public String getImagePath() {
        return imagePath;
    }

    public String getThumbnailPath() {
        return thumbnailPath;
    }

    public String getMimeType() {
        return mimeType;
    }

    // Add any additional methods or properties as needed
}
    @ReactMethod
    public void showNotification(String title, String message) {
        Context context = getReactApplicationContext();

        // Uri soundUri = Uri.parse("android.resource://" + context.getPackageName() + "/" + R.raw.custom_sound);
        // Uri soundUri = Uri.parse("content://media/external_primary/audio/media/57?title=Beginning&canonical=1");

        SharedPreferences channelNamePref = reactContext.getSharedPreferences("notiChannelName", Activity.MODE_PRIVATE);
        String channelNameValue = channelNamePref.getString("notiChannelNameValue", null);


        SharedPreferences prefs = reactContext.getSharedPreferences("notiSound", Activity.MODE_PRIVATE);
        String storedValue = prefs.getString("notiSoundUrl", null);


        String storedValueUrl;
        if (storedValue != null) {
            storedValueUrl = storedValue;
        } 
        else {
            storedValueUrl = "";
            // storedValueUrl  = "android.resource://" + context.getPackageName() + "/" + R.raw.custom_sound;
        }
        Uri soundUri = Uri.parse(storedValueUrl);
        NotificationManager mNotificationManager = (NotificationManager) context.getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationChannel mChannel;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                mChannel = new NotificationChannel(channelNameValue, "sample", NotificationManager.IMPORTANCE_HIGH);
                mChannel.setLightColor(Color.GRAY);
                mChannel.enableLights(true);
                mChannel.setDescription("CHANNEL_SIREN_DESCRIPTION");
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                        .build();
                mChannel.setSound(soundUri, audioAttributes);

                if (mNotificationManager != null) {
                    mNotificationManager.createNotificationChannel( mChannel );
                }
        }

        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context, channelNameValue)
                .setSmallIcon(R.drawable.ic_notification)
                .setLargeIcon(BitmapFactory.decodeResource(context.getApplicationContext().getResources(), R.mipmap.ic_launcher))
                .setTicker(title)
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setLights(0xff0000ff, 300, 1000) // blue color
                .setWhen(System.currentTimeMillis())
                .setPriority(NotificationCompat.PRIORITY_HIGH);

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                mBuilder.setSound(soundUri);
        }

        int NOTIFICATION_ID = 1; // Causes to update the same notification over and over again.
        if (mNotificationManager != null) {
            mNotificationManager.notify(NOTIFICATION_ID, mBuilder.build());
        }
        
    }


    private Promise soundPickerPromise;
    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == 0) {
                if (resultCode == Activity.RESULT_OK) {
                    System.out.println(data);
                    Uri uri = data.getParcelableExtra(RingtoneManager.EXTRA_RINGTONE_PICKED_URI);
                    if (uri != null) {
                        String soundUri = (uri != null) ? uri.toString() : null;
                        if (soundPickerPromise != null) {
                            soundPickerPromise.resolve(soundUri);
                        }
                    } else {
                        if (soundPickerPromise != null) {
                            soundPickerPromise.resolve("none");
                        }
                    }
                    
                } else if (resultCode == Activity.RESULT_CANCELED) {
                    
                    if (soundPickerPromise != null) {
                        soundPickerPromise.resolve("back");
                    }
                }
                soundPickerPromise = null;
            }
        }
    };

    @ReactMethod
    public void openSystemSoundPicker(Promise promise) {
        try {
            soundPickerPromise = promise;
            Intent intent = new Intent(RingtoneManager.ACTION_RINGTONE_PICKER);
            intent.putExtra(RingtoneManager.EXTRA_RINGTONE_TYPE, RingtoneManager.TYPE_NOTIFICATION);
            intent.putExtra(RingtoneManager.EXTRA_RINGTONE_TITLE, "Select Notification Tone");
            SharedPreferences prefs = reactContext.getSharedPreferences("notiSound", Activity.MODE_PRIVATE);

            if (prefs.getString("notiSoundUrl", null) != null) {
                intent.putExtra(RingtoneManager.EXTRA_RINGTONE_EXISTING_URI, Uri.parse(prefs.getString("notiSoundUrl", null)));
            }
            // intent.putExtra(RingtoneManager.EXTRA_RINGTONE_EXISTING_URI, );
            getCurrentActivity().startActivityForResult(intent, 0);
        } catch (Exception e) {
            if (promise != null) {
                promise.reject(e);
            }
        }
    }

    String generateUniqueChannelName(String baseName) {
        // Append a unique identifier (e.g., timestamp or random string)
        String uniqueIdentifier = String.valueOf(System.currentTimeMillis());
        return baseName + "_" + uniqueIdentifier;
    }

    @ReactMethod
    public void saveSelectedSoundURI(String uriString) {
        SharedPreferences.Editor editor = reactContext.getSharedPreferences("notiSound", Activity.MODE_PRIVATE).edit();
        editor.putString("notiSoundUrl", uriString);
        editor.apply();
        Context context = getReactApplicationContext();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            SharedPreferences channelNameDeletePref = reactContext.getSharedPreferences("notiChannelName", Activity.MODE_PRIVATE);
            String channelNameValueDelete = channelNameDeletePref.getString("notiChannelNameValue", null);
            notificationManager.deleteNotificationChannel(channelNameValueDelete);

            String baseChannelName = "YourBaseChannelName";
            SharedPreferences.Editor editor_ = reactContext.getSharedPreferences("notiChannelName", Activity.MODE_PRIVATE).edit();
            editor_.putString("notiChannelNameValue", generateUniqueChannelName(baseChannelName));
            editor_.apply();
        }
    }

    @ReactMethod
    public void getSelectedSoundURI(Promise promise) {
        SharedPreferences prefs = reactContext.getSharedPreferences("notiSound", Activity.MODE_PRIVATE);
        promise.resolve(prefs.getString("notiSoundUrl", null));
        // return prefs.getString("notiSoundUrl", null);
    }
    

    //



   

    @NonNull
    @Override
    public String getName() {
        return "MyContactsModule";
    }

    @ReactMethod
    public void getPhoneID(Promise response) {
        try {
            @SuppressLint("HardwareIds") String id = Settings.Secure.getString(reactContext.getContentResolver(), Settings.Secure.ANDROID_ID);
            response.resolve(id);
        } catch (Exception e) {
            response.reject("Error", e);
        }
    }
    
    
    @ReactMethod
    public void getAll(Promise promise) {
        getAllContacts(promise);
    }

    //  private void getAllContacts(final Promise promise) {
    //     // try {
    //     //     WritableArray contacts = getContactsFromDevice();
    //     //     promise.resolve(contacts);
    //     // } catch (Exception e) {
    //     //     promise.reject("GET_CONTACTS_ERROR", e.getMessage());
    //     // }
    //      AsyncTask<Void,Void,Void> myAsyncTask = new AsyncTask<Void,Void,Void>() {
    //         @Override
    //         protected Void doInBackground(final Void ... params) {
    //             Context context = getReactApplicationContext();
    //             ContentResolver cr = context.getContentResolver();

    //             ContactsProvider contactsProvider = new ContactsProvider(cr);
    //             WritableArray contacts = contactsProvider.getContacts();
    //             promise.resolve(contacts);
    //             return null;
    //         }
    //     };
    //     myAsyncTask.executeOnExecutor(AsyncTask.SERIAL_EXECUTOR);
    // }
    private void getAllContacts(final Promise promise) {
        AsyncTask<Void,Void,Void> myAsyncTask = new AsyncTask<Void,Void,Void>() {
            @Override
            protected Void doInBackground(final Void ... params) {
                Context context = getReactApplicationContext();
                ContentResolver cr = context.getContentResolver();

                ContactsProvider contactsProvider = new ContactsProvider(cr);
                WritableArray contacts = contactsProvider.getContacts();
                promise.resolve(contacts);
                return null;
            }
        };
        myAsyncTask.executeOnExecutor(AsyncTask.SERIAL_EXECUTOR);
    }
    private WritableArray getContactsFromDevice() {
        ContentResolver contentResolver = getCurrentActivity().getContentResolver();
        Cursor cursor = contentResolver.query(
                ContactsContract.Contacts.CONTENT_URI,
                null,
                null,
                null,
                null
        );

        WritableArray contactsArray = Arguments.createArray();

        if (cursor != null && cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                String firstName = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME_PRIMARY));
                String lastName = cursor.getString(cursor.getColumnIndex(ContactsContract.CommonDataKinds.StructuredName.FAMILY_NAME));
                String mobileNumber = "";

                if (cursor.getInt(cursor.getColumnIndex(ContactsContract.Contacts.HAS_PHONE_NUMBER)) > 0) {
                    Cursor phoneCursor = contentResolver.query(
                            ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                            null,
                            ContactsContract.CommonDataKinds.Phone.CONTACT_ID + " = ?",
                            new String[]{cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts._ID))},
                            null
                    );

                    if (phoneCursor != null && phoneCursor.moveToFirst()) {
                        mobileNumber = phoneCursor.getString(phoneCursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
                        phoneCursor.close();
                    }
                }

                WritableMap contactMap = Arguments.createMap();
                contactMap.putString("firstName", firstName);
                contactMap.putString("lastName", lastName);
                contactMap.putString("mobileNumber", mobileNumber);

                contactsArray.pushMap(contactMap);
            }
            cursor.close();
        }

        return contactsArray;
    }
    // private WritableArray getContactsFromDevice() {
    //     WritableArray contactsArray = Arguments.createArray();
    //     ContentResolver cr = getReactApplicationContext().getContentResolver();
    //     Cursor cur = cr.query(ContactsContract.Contacts.CONTENT_URI,
    //             null, null, null, null);

    //     if ((cur != null ? cur.getCount() : 0) > 0) {
    //         while (cur != null && cur.moveToNext()) {
    //             String id = cur.getString(cur.getColumnIndex(ContactsContract.Contacts._ID));
    //             String name = cur.getString(cur.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME));
    //             contactsArray.pushString(name);
    //         }
    //     }

    //     if(cur!=null){
    //         cur.close();
    //     }

    //     return contactsArray;
    // }

    private static final int READ_EXTERNAL_STORAGE_PERMISSION_REQUEST_CODE = 1;



public static ArrayList<String> getPdfList(Context context) {
        ArrayList<String> pdfList = new ArrayList<>();
        Uri collection;

        final String[] projection = new String[]{
                MediaStore.Files.FileColumns.DISPLAY_NAME,
                MediaStore.Files.FileColumns.DATE_ADDED,
                MediaStore.Files.FileColumns.DATA,
                MediaStore.Files.FileColumns.MIME_TYPE,
        };

        final String sortOrder = MediaStore.Files.FileColumns.DATE_ADDED + " DESC";

        final String selection = MediaStore.Files.FileColumns.MIME_TYPE + " = ?";

        final String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension("pdf");
        final String[] selectionArgs = new String[]{mimeType};

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            collection = MediaStore.Files.getContentUri(MediaStore.VOLUME_EXTERNAL);
        } else {
            collection = MediaStore.Files.getContentUri("external");
        }

        ContentResolver contentResolver = context.getContentResolver();

        try (Cursor cursor = contentResolver.query(collection, projection, selection, selectionArgs, sortOrder)) {
            assert cursor != null;

            if (cursor.moveToFirst()) {
                int columnData = cursor.getColumnIndex(MediaStore.Files.FileColumns.DATA);
                do {
                    pdfList.add(cursor.getString(columnData));
                    Log.d("MyContactsModule", "getPdf: " + cursor.getString(columnData));
                    // You can get your pdf files
                } while (cursor.moveToNext());
            }
        }
        return pdfList;
    }
    // private void searchForPdfFiles(File directory, ArrayList<String> pdfPaths) {
    //     File[] files = directory.listFiles();
    //     if (files != null) {
    //         for (File file : files) {
    //             if (file.isDirectory()) {
    //                 // Recursive call for subdirectories
    //                 searchForPdfFiles(file, pdfPaths);
    //             } else {
    //                 // Check if the file is a PDF (you can add more checks if needed)
    //                 if (file.getName().toLowerCase().endsWith(".pdf")) {
    //                     pdfPaths.add(file.getAbsolutePath());
    //                 }
    //             }
    //         }
    //     }
    // }
private List<String> getPdfFiles(Context context) {
        List<String> pdfPaths = new ArrayList<>();

        // Define the URI and projection for PDF files
        Uri collection = MediaStore.Files.getContentUri("external");
        String[] projection = { MediaStore.Files.FileColumns._ID, MediaStore.Files.FileColumns.DATA };
        String selection = MediaStore.Files.FileColumns.MIME_TYPE + "=?";
        String[] selectionArgs = new String[]{"application/pdf"};
        String sortOrder = null;

        // Query the MediaStore to get PDF files
        try (Cursor cursor = context.getContentResolver().query(collection, projection, selection, selectionArgs, sortOrder)) {
            if (cursor != null && cursor.moveToFirst()) {
                do {
                    // Retrieve the file path
                    String filePath = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns.DATA));

                    // Add the file path to the list
                    pdfPaths.add(filePath);
                } while (cursor.moveToNext());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return pdfPaths;
    }
     public static ArrayList<String> getAllPhotos_(Context context) {
        ArrayList<String> photoPaths = new ArrayList<>();
        Log.d("MyContactsModule", "Before Permkission");
        System.out.println("Before Permkission");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            Log.d("MyContactsModule", "After IF Permkission ");
            System.out.println("After IF Permkission ");
        } 

        

        if(Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU){
requestStoragePermission(context);
if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_MEDIA_IMAGES)
                    != PackageManager.PERMISSION_GRANTED) {
                return photoPaths;
            }
 if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
    // requestPermissions.launch(arrayOf(Manifest.permission.READ_MEDIA_IMAGES, Manifest.permission.READ_MEDIA_VIDEO));
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_MEDIA_IMAGES)
                    != PackageManager.PERMISSION_GRANTED) {
                requestStoragePermission(context);
                return photoPaths;
            }
        } else {
            Log.d("PhotoFetcher", "Device doesn't require runtime permission check.");
        }

}
        else {
            Log.d("MyContactsModule", "Device doesn't require runtime permission check.");
        }

        String[] projection = {MediaStore.Images.Media.DATA};
        ContentResolver contentResolver = context.getContentResolver();
        Uri uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
        // Uri uri =  MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL);

        Cursor cursor = null;
        try {
            cursor = contentResolver.query(uri, projection, null, null, null);

            if (cursor != null) {
                int dataIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);

                while (cursor.moveToNext()) {
                    String path = cursor.getString(dataIndex);
                    photoPaths.add(path);
                    Log.d("MyContactsModule", "Photo path: " + path);
                }

                if (photoPaths.isEmpty()) {
                    Log.d("MyContactsModule", "No photos available");
                } else {
                    Log.d("MyContactsModule", "Fetched Photos: " + photoPaths);
                }
            } else {
                Log.e("MyContactsModule", "Cursor is null while fetching photos");
            }
        } catch (Exception e) {
            Log.e("MyContactsModule", "Error fetching photos", e);
        } finally {
            if (cursor != null && !cursor.isClosed()) {
                cursor.close();
            }
        }

        return photoPaths;
        
   

    }
    
    public static ArrayList<PhotoData> getAllPhotos(Context context) {
    ArrayList<PhotoData> photoDataList = new ArrayList<>();
    
    // Check permissions
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        // Handle permissions for Android Q and above
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        // Handle permissions for Android Marshmallow and above
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            requestStoragePermission(context);
            return photoDataList;
        }
    } else {
        // For devices below Android Marshmallow, no runtime permission check is needed
        Log.d("MyContactsModule", "Device doesn't require runtime permission check.");
    }

    // Projection to fetch image data and thumbnail path
    String[] projection = {MediaStore.Images.Media.DATA, MediaStore.Images.Thumbnails.DATA};
    ContentResolver contentResolver = context.getContentResolver();
    Uri uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;

    Cursor cursor = null;
    try {
        cursor = contentResolver.query(uri, projection, null, null, null);

        if (cursor != null) {
            int dataIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            int thumbnailIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Thumbnails.DATA);

            while (cursor.moveToNext()) {
                String path = cursor.getString(dataIndex);
                Uri fileUri = Uri.parse("file://" + path);
                String mimeType  = "";
                // = getMimeType(context, fileUri);

                // Get thumbnail path
                String thumbnailPath = cursor.getString(thumbnailIndex);

                // Create PhotoData object and add to the list
                // photoDataList.add(new PhotoData(path, thumbnailPath, mimeType));

                Log.d("MyContactsModule", "Photo path: " + path + ", Thumbnail path: " + thumbnailPath + ", MIME type: " + mimeType);
            }

            if (!photoDataList.isEmpty()) {
                Log.d("MyContactsModule", "Fetched Photos: " + photoDataList);
            } else {
                Log.d("MyContactsModule", "No photos available");
            }
        } else {
            Log.e("MyContactsModule", "Cursor is null while fetching photos");
        }
    } catch (Exception e) {
        Log.e("MyContactsModule", "Error fetching photos", e);
    } finally {
        if (cursor != null && !cursor.isClosed()) {
            cursor.close();
        }
    }

    return photoDataList;
}



    private static void requestStoragePermission(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ActivityCompat.requestPermissions(getActivity(context),
                    new String[]{Manifest.permission.READ_MEDIA_IMAGES},
                    READ_EXTERNAL_STORAGE_PERMISSION_REQUEST_CODE);
        }
    }


    private static Activity getActivity(Context context) {
        if (context instanceof ReactApplicationContext) {
            ReactApplicationContext reactContext = (ReactApplicationContext) context;
            Activity currentActivity = reactContext.getCurrentActivity();

            if (currentActivity != null) {
                return currentActivity;
            } else {
                Log.e("PhotoFetcher", "Current activity is null");
                return null;
            }
        } else {
            Log.e("PhotoFetcher", "Invalid context type");
            return null;
        }
    }

    public List<Uri> getAllImages__(Context context) {
        List<Uri> imageList = new ArrayList<>();

        // Set up the content resolver
        ContentResolver contentResolver = context.getContentResolver();

        // Define the projection (columns to retrieve)
        String[] projection = {
                MediaStore.Images.Media._ID,
                MediaStore.Images.Media.DATA
        };

        // Set up the cursor to query the MediaStore
        Cursor cursor = contentResolver.query(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                projection,
                null,
                null,
                MediaStore.Images.Media.DATE_ADDED + " DESC"
        );

        // Check if the cursor is not null and move through the images
        if (cursor != null) {
            int idColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID);
            while (cursor.moveToNext()) {
                // Get the ID of the image
                long id = cursor.getLong(idColumn);

                // Generate the URI for the image using the ID
                Uri contentUri = ContentUris.withAppendedId(
                        MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                        id
                );

                // Add the URI to the list
                imageList.add(contentUri);
            }

            // Close the cursor
            cursor.close();
        }

        return imageList;
    }

    @ReactMethod
    public void getAllPhotos(Callback callback) {
        try {
            ArrayList<String> photoPaths = getAllPhotos_(getReactApplicationContext());
            WritableArray writableArray = Arguments.createArray();
            for (String path : photoPaths) {
                writableArray.pushString(path);
            }

            callback.invoke(null, writableArray);

        } catch (Exception e) {
            callback.invoke(e.getMessage(), null);
        }
    }
}







// package com.ziroh.zunumessage.Sms.notificationToneManager;

// import com.facebook.react.bridge.Promise;
// import android.net.Uri;
// import com.facebook.react.modules.core.DeviceEventManagerModule;
// import com.facebook.react.bridge.ActivityEventListener;
// import com.facebook.react.bridge.BaseActivityEventListener;

// import android.app.Activity;
// import android.content.Intent;
// import android.content.SharedPreferences;
// import android.media.RingtoneManager;

// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;

// public class NotificationToneModule extends ReactContextBaseJavaModule {

//     private final ReactApplicationContext reactContext;
//     private final String PREFS_NAME = "NotificationTonePrefs"; // SharedPreferences file name
//     private final String PREF_SELECTED_SOUND_URI = "selectedSoundUri"; // Key for storing sound URI

//     public NotificationToneModule(ReactApplicationContext reactContext) {
//         super(reactContext);
//                 reactContext.addActivityEventListener(activityEventListener);

//         this.reactContext = reactContext;
//     }

//     @Override
//     public String getName() {
//         return "NotificationToneModule";
//     }
//  private Promise soundPickerPromise;
//     private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
//         @Override
//         public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
//             if (requestCode == 0) {
//                 if (resultCode == Activity.RESULT_OK) {
//                     Uri uri = data.getParcelableExtra(RingtoneManager.EXTRA_RINGTONE_PICKED_URI);
//                     String soundUri = (uri != null) ? uri.toString() : null;
//                     if (soundPickerPromise != null) {
//                         soundPickerPromise.resolve(soundUri);
//                     }
//                 } else if (resultCode == Activity.RESULT_CANCELED) {
//                     if (soundPickerPromise != null) {
//                         soundPickerPromise.resolve(null);
//                     }
//                 }
//                 soundPickerPromise = null;
//             }
//         }
//     };

//     // @ReactMethod
//     // public void openSystemSoundPicker() {
//     //     Activity currentActivity = getCurrentActivity();
//     //     if (currentActivity != null) {
//     //         Intent intent = new Intent(RingtoneManager.ACTION_RINGTONE_PICKER);
//     //         intent.putExtra(RingtoneManager.EXTRA_RINGTONE_TYPE, RingtoneManager.TYPE_NOTIFICATION);
//     //         intent.putExtra(RingtoneManager.EXTRA_RINGTONE_TITLE, "Select Notification Tone");
//     //         currentActivity.startActivityForResult(intent, 123); // Handle the result in your activity
//     //     }
//     // }
//     @ReactMethod
//     public void openSystemSoundPicker(Promise promise) {
//         try {
//             soundPickerPromise = promise;
//             Intent intent = new Intent(RingtoneManager.ACTION_RINGTONE_PICKER);
//             intent.putExtra(RingtoneManager.EXTRA_RINGTONE_TYPE, RingtoneManager.TYPE_NOTIFICATION);
//             intent.putExtra(RingtoneManager.EXTRA_RINGTONE_TITLE, "Select Notification Tone");
//             intent.putExtra(RingtoneManager.EXTRA_RINGTONE_EXISTING_URI, (Uri) null);
//             getCurrentActivity().startActivityForResult(intent, 0);
//         } catch (Exception e) {
//             if (promise != null) {
//                 promise.reject(e);
//             }
//         }
//     }
    
//     @ReactMethod
//     public void saveSelectedSoundURI(String uriString) {
//         SharedPreferences.Editor editor = reactContext.getSharedPreferences(PREFS_NAME, Activity.MODE_PRIVATE).edit();
//         editor.putString(PREF_SELECTED_SOUND_URI, uriString);
//         editor.apply();
//     }

//     @ReactMethod
//     public String getSelectedSoundURI() {
//         SharedPreferences prefs = reactContext.getSharedPreferences(PREFS_NAME, Activity.MODE_PRIVATE);
//         return prefs.getString(PREF_SELECTED_SOUND_URI, null);
//     }
// }



// package com.ziroh.zunumessage.mediaAccess;

// import android.Manifest;
// import android.app.Activity;
// import android.content.ContentResolver;
// import android.content.Context;
// import android.content.pm.PackageManager;
// import android.database.Cursor;
// import android.net.Uri;
// import android.os.Build;
// import android.util.Log;
// import android.provider.MediaStore;
// import android.database.Cursor;
// import androidx.core.app.ActivityCompat;
// import androidx.core.content.ContextCompat;

// import com.facebook.react.bridge.ReactApplicationContext;

// import java.util.ArrayList;

// public class PhotoFetcher {

//     private static final int READ_EXTERNAL_STORAGE_PERMISSION_REQUEST_CODE = 1;

   

// }