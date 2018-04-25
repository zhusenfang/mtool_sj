package com.project.rnmodule;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.project.rnview.RNDaisongView;

/**
 * Created by sshss on 2017/11/6.
 */

public class DaisongModual extends BaseModule {
    private final ReactApplicationContext mReactContext;

    public DaisongModual(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DaisongModual";
    }

    @ReactMethod
    public void setShopLocation(int tag, double latitud, double longitude) {
        System.out.println("setShopLocation: " + tag + "  " + latitud + " " + longitude);
        RNDaisongView daisongView = (RNDaisongView) mReactContext.getCurrentActivity().findViewById(tag);
        daisongView.setShopLocation(latitud, longitude);
    }
}
