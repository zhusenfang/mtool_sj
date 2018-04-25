package com.project.rnmanager;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.project.rnview.RNAddressLocateView;

/**
 * Created by sshss on 2017/10/29.
 */

public class AddressLocateViewManager extends SimpleViewManager<RNAddressLocateView> {
    @Override
    public String getName() {
        return "RNAddressLocateView";
    }

    @Override
    protected RNAddressLocateView createViewInstance(ThemedReactContext reactContext) {
        return new RNAddressLocateView(reactContext);
    }
}
