package com.project.rnmodule;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.project.MyApplication;

/**
 * Created by sshss on 2017/11/9.
 */

public abstract class BaseModule extends ReactContextBaseJavaModule {

    public BaseModule(ReactApplicationContext reactContext) {
        super(reactContext);
        MyApplication.getInstance().reactiContext = reactContext;
    }
}
