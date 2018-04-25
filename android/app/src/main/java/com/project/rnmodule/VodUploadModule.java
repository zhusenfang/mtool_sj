package com.project.rnmodule;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.provider.MediaStore;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.project.util.RnEventUtil;
import com.project.util.ToastUtils;
import com.project.util.VideoUploadUtil;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by sshss on 2017/11/30.
 */

public class VodUploadModule extends BaseModule implements ActivityEventListener {
    private ReactApplicationContext mContext;
    private static final int REQUEST_CODE_LOCAL_VIDEO = 7878;
    private VideoUploadUtil mUploadUtil;

    public VodUploadModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        mContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "VodUploadModule";
    }

    @ReactMethod
    public void getVideo() {
        System.out.println("getVideo");
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setType("video/*");
        mContext.getCurrentActivity().startActivityForResult(intent, REQUEST_CODE_LOCAL_VIDEO);
    }

    @ReactMethod
    public void destroy() {
        if (mUploadUtil != null)
            mUploadUtil.stop();
    }

    @ReactMethod
    public void reUpload() {
        if (mUploadUtil != null)
            mUploadUtil.reUpLoad();
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (getCurrentActivity() == null) {
            System.out.println("getCurrentActivity  ~nullll ");
            return;
        }
        if (resultCode == Activity.RESULT_OK && requestCode == REQUEST_CODE_LOCAL_VIDEO) {
            if (data != null) {
                final Uri uri = data.getData();
                System.out.println("uri: " + uri.getPath());
                String[] filePathColumn = {MediaStore.Images.Media.DATA};
                Cursor cursor = mContext.getContentResolver().query(uri, filePathColumn, null, null, null);
                if (cursor != null) {
                    cursor.moveToFirst();
                    int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                    String path = cursor.getString(columnIndex);
                    cursor.close();
                    cursor = null;
                    System.out.println("video path: " + path);
                    if (path == null) {
                        ToastUtils.showToast("找不到该视频");
                        return;
                    }
                    Bitmap localVideoThumbnail = getLocalVideoThumbnail(path);
                    String imagePath = null;
                    if (localVideoThumbnail != null)
                        imagePath = saveBitmap(mContext.getCacheDir(), localVideoThumbnail);

                    System.out.println("imagePath; " + imagePath);
                    RnEventUtil.emit(mContext, "onCoverImage", imagePath);
                    if (mUploadUtil == null)
                        mUploadUtil = VideoUploadUtil.getInstance();
                    mUploadUtil.stop();
                    mUploadUtil.setOnUploadListener(new VideoUploadUtil.OnUploadListener() {
                        @Override
                        public void onUploadFaild() {
                            getCurrentActivity().runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    RnEventUtil.emit(mContext, "onUploadFaild", "");
                                }
                            });
                        }

                        @Override
                        public void onUploadSuccess() {
                            getCurrentActivity().runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    String videoId = mUploadUtil.getVideoId();
                                    System.out.println("onUploadSuccess:" + videoId);
                                    RnEventUtil.emit(mContext, "onUploadSuccess", videoId);
                                }
                            });
                        }

                        @Override
                        public void onProgress(final long uploadedSize, final long totalSize) {
                            getCurrentActivity().runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    int progress = (int) (uploadedSize * 100 / totalSize);
                                    System.out.println(progress + "%");

                                    WritableMap event = Arguments.createMap();

                                    RnEventUtil.emit(mContext, "onProgress", progress);
                                }
                            });

                        }

                        @Override
                        public void onStart() {

                        }
                    }).upload(path);
                }
            }
        }

    }


    public String saveBitmap(File file, Bitmap bitmap) {
        File f = new File(file, "temp_vod_cover.png");
        if (f.exists()) {
            f.delete();
        }
        try {
            FileOutputStream out = new FileOutputStream(f);
            bitmap.compress(Bitmap.CompressFormat.PNG, 90, out);
            out.flush();
            out.close();
            System.out.println("保存成功");
            return f.getAbsolutePath();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Bitmap getLocalVideoThumbnail(String filePath) {
        Bitmap bitmap = null;
        MediaMetadataRetriever retriever = new MediaMetadataRetriever();
        try {
            retriever.setDataSource(filePath);
            bitmap = retriever.getFrameAtTime();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } finally {
            retriever.release();
        }
        return bitmap;
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
