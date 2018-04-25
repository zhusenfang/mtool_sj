package com.project.rnmanager;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.project.rnview.RNDaisongView;

/**
 * Created by sshss on 2017/10/29.
 */

public class DaisongViewManager extends SimpleViewManager<RNDaisongView> {
    @Override
    public String getName() {
        return "RNDaisongView";
    }

    @Override
    protected RNDaisongView createViewInstance(ThemedReactContext reactContext) {
        return new RNDaisongView(reactContext);
    }
}
