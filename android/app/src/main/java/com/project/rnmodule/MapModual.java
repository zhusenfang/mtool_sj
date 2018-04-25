package com.project.rnmodule;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.project.activity.AddressLocateActivity;

/**
 * Created by sshss on 2017/11/6.
 */

public class MapModual extends BaseModule implements LifecycleEventListener, ActivityEventListener {
    private final ReactApplicationContext mReactContext;
    private final MapReceiver mapReceiver;

    public MapModual(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        reactContext.addLifecycleEventListener(this);
        reactContext.addActivityEventListener(this);
        mapReceiver = new MapReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction("action.mapmodule");//添加过滤条件
        filter.setPriority(Integer.MAX_VALUE);
        // filter.addDataScheme("package");//如果接收包的安装和卸载，则必须有这个。
        mReactContext.registerReceiver(mapReceiver, filter);
    }

    @Override
    public String getName() {
        return "MapModual";
    }

    @ReactMethod
    public void toMapActivity() {
        Intent intent = new Intent(mReactContext, AddressLocateActivity.class);
//        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mReactContext.startActivityForResult(intent, 99, null);
    }


    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        try {
            mReactContext.unregisterReceiver(mapReceiver);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
//        if (data != null) {
//            PoiItem poiItem = data.getParcelableExtra(Const.LOC_INFO);
//            WritableMap event = Arguments.createMap();
//            event.putString("address", poiItem.getSnippet());
//            event.putDouble("latitude", poiItem.getLatLonPoint().getLatitude());
//            event.putDouble("longitude", poiItem.getLatLonPoint().getLongitude());
//            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                    .emit("data", event);
//        }
    }


    @Override
    public void onNewIntent(Intent intent) {

    }

    public class MapReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            WritableMap event = Arguments.createMap();
//            WritableArray array = Arguments.createArray();
            if (intent.getStringExtra("action") != null) {
                System.out.println("action: " + intent.getStringExtra("action"));
                event.putString("action", intent.getStringExtra("action"));
                mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("event", event);
            }
        }
    }
}
