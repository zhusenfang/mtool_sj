package com.project.util;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by sshss on 2017/11/30.
 */

public class RnEventUtil {
    public static void emit(ReactApplicationContext context, String event, Object value) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(event, value);
    }
}