package com.project.chat.manager;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.project.chat.view.ConverSationsView;

/**
 * Created by sshss on 2017/12/20.
 */

public class ConversationsViewManager extends SimpleViewManager<ConverSationsView> {
    @Override
    public String getName() {
        return "ConverSationsView";
    }

    @Override
    protected ConverSationsView createViewInstance(ThemedReactContext reactContext) {
        return new ConverSationsView(reactContext);
    }
}
