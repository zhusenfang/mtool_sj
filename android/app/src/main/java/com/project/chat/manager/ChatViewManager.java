package com.project.chat.manager;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.project.chat.view.ChatView;

/**
 * Created by sshss on 2017/12/23.
 */

public class ChatViewManager extends SimpleViewManager<ChatView> {
    @Override
    public String getName() {
        return "ChatView";
    }

    @Override
    protected ChatView createViewInstance(ThemedReactContext reactContext) {
        return new ChatView(reactContext);
    }
}
