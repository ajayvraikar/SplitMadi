@ReactMethod
public void getAllPhotos(int pageSize, int pageNumber, Callback callback) {
    Context context = getReactApplicationContext();

    ArrayList<String> photoPaths = new ArrayList<>();
    ArrayList<String> thumbnailBase64List = new ArrayList<>();
    ArrayList<String> mimeTypes = new ArrayList<>();

    // Calculate offset based on page number and page size
    int offset = pageNumber * pageSize;

    // Check permissions if required
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            callback.invoke("Permission Not Found", photoPaths);
            return;
        }
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

        if (cursor != null) {
            // Move the cursor to the offset
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
