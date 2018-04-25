package com.project.chat.manager;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.project.chat.customview.EaseChatInputMenu;

/**
 * Created by sshss on 2017/10/29.
 */

public class InputViewManager extends SimpleViewManager<EaseChatInputMenu> {
    @Override
    public String getName() {
        return "InputView";
    }

    @Override
    protected EaseChatInputMenu createViewInstance(ThemedReactContext reactContext) {
        return new EaseChatInputMenu(reactContext);
    }
}
