package com.project;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import android.support.multidex.MultiDex;

import com.alivc.player.AliVcMediaPlayer;
import com.alivc.player.VcPlayerLog;
import com.amap.api.maps.MapView;
import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.project.activity.BaseActivity;
import com.project.chat.ChatHelper;
import com.project.chat.ChatPackage;
import com.project.rnpackage.DaisongViewPackage;
import com.project.rnpackage.MapPackage;
import com.project.rnpackage.VideoPlayerPackage;
import com.project.rnpackage.VodUploadPackage;
import com.theweflex.react.WeChatPackage;
import com.umeng.socialize.PlatformConfig;
import com.yunpeng.alipay.AlipayPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.BuildConfig;
import cn.jpush.reactnativejpush.JPushPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import module.SharePackage;

public class MyApplication extends Application implements ReactApplication {
    private boolean SHUTDOWN_TOAST = false;
    private boolean SHUTDOWN_LOG = false;
    private List<Activity> mActivities = new ArrayList<>();
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new PickerViewPackage(),
                    new WeChatPackage(),
                    new RCTCameraPackage(),
                    new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
                    new ImagePickerPackage(),
                    new MapPackage(),
                    new DaisongViewPackage(),
                    new ImageResizerPackage(),
                    new VodUploadPackage(),
                    new VideoPlayerPackage(),
                    new ChatPackage(),
                    new SharePackage(),
                    new AlipayPackage()

//                    new RNSyanImagePickerPackage()
            );
        }

    };
    private static MyApplication sInstance;
    public Bundle bundle;
    public MapView map;
    public ReactApplicationContext reactiContext;

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(base);
    }


    public static MyApplication getInstance() {
        return sInstance;
    }

    public static MyApplication getContext() {
        return sInstance;
    }

    public void addActivity(BaseActivity baseActivity) {
        mActivities.add(baseActivity);
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        sInstance = this;

        ////////////////初始化播放器//////////
        VcPlayerLog.enableLog();
        AliVcMediaPlayer.init(getApplicationContext(), "");
        ////////////////////////////
        //=============聊天===========
        ChatHelper.getInstance().init(this);
        //============================
    }
    {
        PlatformConfig.setQQZone("1106689082","BqrxqBQO93Cl3lxy");
        PlatformConfig.setSinaWeibo("2733400964", "fac50980a44e3e3afd4bc968ea572887","www.baidu.com");
    }
    public void removeAvctivity(BaseActivity baseActivity) {
        if (mActivities != null)
            mActivities.remove(baseActivity);
    }

    public void clearActivity() {
        if (mActivities != null)
            for (int i = 0; i < mActivities.size(); i++) {
                Activity activity = mActivities.get(i);
                if (activity != null && !activity.getClass().getName().contains("MainActivity")) {
                    activity.finish();
                }
            }
    }



}
