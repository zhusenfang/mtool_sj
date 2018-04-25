package com.project.rnmanager;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.project.rnview.LocationShareView;

/**
 * Created by sshss on 2017/10/29.
 */

public class LocationShareViewManager extends SimpleViewManager<LocationShareView> {
    @Override
    public String getName() {
        return "LocationShareView";
    }

    @Override
    protected LocationShareView createViewInstance(ThemedReactContext reactContext) {
        return new LocationShareView(reactContext);
    }
}
