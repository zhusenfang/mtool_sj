package com.project.chat;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.project.chat.manager.ChatViewManager;
import com.project.chat.manager.ConversationsViewManager;
import com.project.chat.manager.InputViewManager;
import com.project.chat.module.ChatModule;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by sshss on 2017/12/20.
 */

public class ChatPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ChatModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers =new ArrayList<>();
        viewManagers.add(new ChatViewManager());
        viewManagers.add(new ConversationsViewManager());
        viewManagers.add(new InputViewManager());
        return viewManagers;
    }
}
