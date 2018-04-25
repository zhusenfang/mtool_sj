package com.project.chat.module;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.hyphenate.EMCallBack;
import com.hyphenate.chat.EMClient;
import com.project.bean.ChatShareBean;
import com.project.chat.ChatHelper;
import com.project.chat.EaseConstant;
import com.project.chat.EaseConstantSub;
import com.project.chat.customview.EaseChatInputMenu;
import com.project.chat.model.DemoModel;
import com.project.chat.util.Messenger;
import com.project.chat.view.ChatView;
import com.project.chat.view.ConverSationsView;
import com.project.config.Const;
import com.project.rnmodule.BaseModule;
import com.project.util.BottomNotifier;
import com.project.util.Json_U;
import com.project.util.SPUtil;
import com.project.util.ToastUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by sshss on 2017/12/21.
 */

public class ChatModule extends BaseModule {
    private ChatActionReceiver mReceiver;
    private ReactApplicationContext mContext;
    private ChatView chatView;

    public ChatModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        mReceiver = new ChatActionReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction("action.chatmodule");
        filter.setPriority(Integer.MAX_VALUE);
        // filter.addDataScheme("package");
        mContext.registerReceiver(mReceiver, filter);
        mContext.addActivityEventListener(new ActivityEventListener() {
            @Override
            public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
                if (chatView != null) {
                    chatView.onActivityResult(activity, requestCode, resultCode, data);
                }
            }

            @Override
            public void onNewIntent(Intent intent) {

            }
        });
    }

    @Override
    public String getName() {
        return "ChatModule";
    }

    private Bitmap generateBitmap(String content, int width, int height) {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        Map<EncodeHintType, String> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
        try {
            BitMatrix encode = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, width, height, hints);
            int[] pixels = new int[width * height];
            for (int i = 0; i < height; i++) {
                for (int j = 0; j < width; j++) {
                    if (encode.get(j, i)) {
                        pixels[i * width + j] = 0x00000000;
                    } else {
                        pixels[i * width + j] = 0xffffffff;
                    }
                }
            }
            return Bitmap.createBitmap(pixels, 0, width, width, height, Bitmap.Config.RGB_565);
        } catch (WriterException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String saveBitmap(Context context, Bitmap mBitmap) {
        String savePath = Environment.getExternalStorageDirectory().getPath();
        File filePic = new File(savePath, "liudupay.jpg");
        try {
            FileOutputStream fos = new FileOutputStream(filePic);
            mBitmap.compress(Bitmap.CompressFormat.JPEG, 100, fos);
            fos.flush();
            fos.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        }
        ToastUtils.showToast("图片以保存到：" + savePath);
        try {
            MediaStore.Images.Media.insertImage(context.getContentResolver(),
                    savePath, "liudupay.jpg", null);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        // 最后通知图库更新
        context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse("file://" + filePic.getAbsolutePath())));

        return filePic.getAbsolutePath();
    }

    @ReactMethod
    public void login(final String hxUserName, String hxPwd, final String nickName, final String head) {
        System.out.println("hx login:" + hxUserName + hxPwd + nickName + head);
        SPUtil.putString(Const.HX_ID, hxUserName);
        SPUtil.putString(Const.HX_PWD, hxPwd);
        SPUtil.putString(Const.USER_NICK, nickName);
        SPUtil.putString(Const.USER_HEADER, head);
        EMClient.getInstance().logout(true);
        EMClient.getInstance().login(hxUserName, hxPwd, new EMCallBack() {

            @Override
            public void onSuccess() {
                System.out.println("环信登录成功");
                EMClient.getInstance().getOptions().setAutoAcceptGroupInvitation(true);
                EMClient.getInstance().groupManager().loadAllGroups();
                EMClient.getInstance().chatManager().loadAllConversations();

                boolean updatenick = EMClient.getInstance().pushManager().updatePushNickname(nickName);
                if (!updatenick) {
                    Log.e("ChatModule", "update current user nick fail");
                }
            }

            @Override
            public void onProgress(int progress, String status) {

            }

            @Override
            public void onError(final int code, final String message) {
                System.out.println("环信登录失败：" + code + "  " + message);
            }
        });
    }

    @ReactMethod
    public void initChatView(final int tag, final String hxId, final int chatType) {
        System.out.println("initChatView：" + tag + "   " + hxId + "   " + chatType);
        final Activity currentActivity = mContext.getCurrentActivity();
        currentActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                chatView = (ChatView) currentActivity.findViewById(tag);
                chatView.initViews(chatType, hxId);
                chatView.setUpView();
                //刷新会话列表，清除未读消息标签
                if (ConverSationsView.sInstance != null) {
                    ConverSationsView.sInstance.refresh();
                }
            }
        });
    }


    @ReactMethod
    public void initInputView(final int tag) {
        final Activity currentActivity = mContext.getCurrentActivity();
        currentActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                EaseChatInputMenu inputMenu = (EaseChatInputMenu) mContext.getCurrentActivity().findViewById(tag);
                if (inputMenu == null) {
                    ToastUtils.showToast("inputMenu null");
                } else {
                    chatView.setInputMenu(inputMenu);
                }
            }
        });

    }

    /**
     * 快捷恢复（群聊）
     *
     * @param tag
     * @param dataJson
     */
    @ReactMethod
    public void setQuickReply(int tag, final String dataJson) {

        if (chatView != null) {
            mContext.getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    chatView.setQuickReplyData(dataJson);
                }
            });
        }
    }

    @ReactMethod
    public boolean isConnected() {
        return EMClient.getInstance().isConnected();
    }

    @ReactMethod
    public void onNewOrder() {
        BottomNotifier.getInstance().nofify("有新订单");
    }

    @ReactMethod
    public void sendShareMessage(int tag, String id, String title, String picUrl) {
        ChatShareBean chatShareBean = new ChatShareBean();
        chatShareBean.id = id + "";
        chatShareBean.title = title;
        chatShareBean.picUrl = picUrl;
        chatShareBean.type = 1;
        if (chatView != null) {
            chatView.sendShareMessage(Json_U.toJson(chatShareBean));
        }
    }

    @ReactMethod
    public void initNotificationSetting() {
        DemoModel model = ChatHelper.getInstance().getModel();
        send("set_silent_mode", SPUtil.getBoolean(Const.CHAT_SILENT_MODE, false));
        send("set_rec_new_msg", model.getSettingMsgNotification());
        send("set_msg_voice", model.getSettingMsgSound());
        send("set_msg_vibrate", model.getSettingMsgVibrate());
    }

    private void send(String action, boolean enable) {
        WritableMap event = Arguments.createMap();
        event.putString("action", action);
        event.putBoolean("enable", enable);
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("event", event);
    }

    /**
     * 勿扰模式
     *
     * @param enable
     */
    @ReactMethod
    public void silentMode(boolean enable) {
        SPUtil.putBoolean(Const.CHAT_SILENT_MODE, enable);
    }

    /**
     * 新消息提醒
     *
     * @param enable
     */
    @ReactMethod
    public void recNewMsg(boolean enable) {
        ChatHelper.getInstance().getModel().setSettingMsgNotification(enable);
    }

    /**
     * 消息提醒声音
     *
     * @param enable
     */
    @ReactMethod
    public void notifySound(boolean enable) {
        ChatHelper.getInstance().getModel().setSettingMsgSound(enable);
    }

    /**
     * 消息震动
     *
     * @param enable
     */
    @ReactMethod
    public void notifyVibrate(boolean enable) {
        ChatHelper.getInstance().getModel().setSettingMsgVibrate(enable);
    }


    private class ChatActionReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            WritableMap event = Arguments.createMap();
            String action = intent.getStringExtra("action");
            if (action != null && mContext != null) {
                if (action.equals(Messenger.TO_USER_DETAIL) || action.equals(Messenger.TO_CHATVIEW)) {
                    String userId = intent.getStringExtra(Const.HX_ID);
                    event.putString(Const.HX_ID, userId);
                    event.putInt(EaseConstantSub.EXTRA_CHAT_TYPE, intent.getIntExtra(EaseConstantSub.EXTRA_CHAT_TYPE, EaseConstant.CHATTYPE_SINGLE));
                }
                if (action.equals(Messenger.TO_ORDER_DETAIL)) {
                    event.putString("orderId", intent.getStringExtra("orderId"));
                }
                event.putString("action", action);
                mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("event", event);
            }
        }
    }
}
