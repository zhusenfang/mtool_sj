package com.project.rnpackage;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.project.rnmanager.AddressLocateViewManager;
import com.project.rnmanager.LocationShareViewManager;
import com.project.rnmodule.MapModual;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by sshss on 2017/11/6.
 */

public class MapPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new MapModual(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers = new ArrayList<>();
        viewManagers.add(new LocationShareViewManager());
        viewManagers.add(new AddressLocateViewManager());
        return viewManagers;

    }
}
