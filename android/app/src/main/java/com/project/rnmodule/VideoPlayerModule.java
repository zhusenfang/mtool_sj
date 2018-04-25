package com.project.rnmodule;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.project.activity.VideoPlayerAcitivity;
import com.project.config.Const;

/**
 * Created by sshss on 2017/11/30.
 */

public class VideoPlayerModule extends BaseModule {
    private ReactApplicationContext mContext;

    public VideoPlayerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "VideoPlayerModule";
    }

    @ReactMethod
    public void playVideo(String coverUrl, String resUrl) {
        mContext.getCurrentActivity().startActivity(new Intent(mContext, VideoPlayerAcitivity.class)
                .putExtra(Const.URL, resUrl)
                .putExtra(Const.COVER_URL, coverUrl)
        );
    }
}
