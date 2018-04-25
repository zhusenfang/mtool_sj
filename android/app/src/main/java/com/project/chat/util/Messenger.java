package com.project.chat.util;

import android.content.Intent;

import com.project.MyApplication;

/**
 * Created by sshss on 2017/12/21.
 */

public class Messenger {
    public static final String TO_LOGIN = "TO_LOGIN";
    public static final String REFRESH = "REFRESH";
    public static final String TO_CHATVIEW = "TO_CHATVIEW";
    public static final String REMOVE_FROM_GROUP = "REMOVE_FROM_GROUP";
    public static final String GROUP_DESTROY = "GROUP_DESTROY";
    public static final String TO_USER_DETAIL = "TO_USER_DETAIL";
    public static final String LOADED = "LOADED";
    public static final String INPUT_MENU_LOADED = "INPUT_MENU_LOADED";
    public static final String QUICK_REPLY = "QUICK_REPLY";
    public static final String TO_ORDER_DETAIL = "TO_ORDER_DETAIL";
    public static final String TO_STATE_DETAIL = "TO_STATE_DETAIL";
    private static Messenger sInstance;
    private static Intent sIntent;

    private Messenger() {

    }
    public static Messenger getInstance(String action) {
        if (sInstance == null)
            sInstance = new Messenger();
        if (sIntent == null) {
            sIntent = new Intent();
            sIntent.setAction("action.chatmodule");
        }
        else
            sIntent.getExtras().clear();
        sIntent.putExtra("action",action);
        return sInstance;
    }

    public Messenger putString(String key, String value) {
        sIntent.putExtra(key,value);
        return sInstance;
    }
    public Messenger putInt(String key, int value) {
        sIntent.putExtra(key,value);
        return sInstance;
    }

    public void send(){
        MyApplication.getContext().sendBroadcast(sIntent);
    }



//    public void send(String action) {
//        Intent intent = new Intent();
//        intent.setAction("action.chatmodule");
//        intent.putExtra("action", action);
//        MyApplication.getContext().sendBroadcast(intent);
//    }
//
//    public void send(String action, String key, String value) {
//        Intent intent = new Intent();
//        intent.setAction("action.chatmodule");
//        intent.putExtra("action", action);
//        intent.putExtra(key, value);
//        MyApplication.getContext().sendBroadcast(intent);
//    }
}
