package com.project.rnpackage;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.project.rnmanager.DaisongViewManager;
import com.project.rnmodule.DaisongModual;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by sshss on 2017/11/6.
 */

public class DaisongViewPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new DaisongModual(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new DaisongViewManager());

    }
}
