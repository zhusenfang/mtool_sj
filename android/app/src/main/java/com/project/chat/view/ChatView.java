package com.project.chat.view;

import android.app.Activity;
import android.content.ClipData;
import android.content.ComponentName;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.View;
import android.widget.BaseAdapter;
import android.widget.Toast;

import com.amap.api.services.core.AMapException;
import com.amap.api.services.core.LatLonSharePoint;
import com.amap.api.services.share.ShareSearch;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMLocationMessageBody;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMTextMessageBody;
import com.hyphenate.exceptions.HyphenateException;
import com.hyphenate.util.PathUtil;
import com.project.MyApplication;
import com.project.R;
import com.project.bean.BusShareLocBean;
import com.project.chat.ChatHelper;
import com.project.chat.ChatRowShare;
import com.project.chat.EaseConstant;
import com.project.chat.EaseConstantSub;
import com.project.chat.activity.ContextMenuActivity;
import com.project.chat.activity.VoiceCallActivity;
import com.project.chat.customview.ChatRowVoiceCall;
import com.project.chat.customview.EaseChatRowRecall;
import com.project.chat.customview.chatrow.EaseChatRow;
import com.project.chat.customview.chatrow.EaseCustomChatRowProvider;
import com.project.chat.util.Messenger;
import com.project.config.Const;
import com.project.util.ToastUtils;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

import java.io.File;

/**
 * Created by sshss on 2017/12/20.
 */

public class ChatView extends ChatBaseView implements ChatBaseView.EaseChatFragmentHelper {
    private static final int ITEM_VIDEO = 11;
    private static final int ITEM_FILE = 12;
    private static final int ITEM_VOICE_CALL = 13;
    private static final int ITEM_VIDEO_CALL = 14;
    private static final int ITEM_QUICK_REPLY = 15;

    private static final int REQUEST_CODE_SELECT_VIDEO = 11;
    private static final int REQUEST_CODE_SELECT_FILE = 12;
    private static final int REQUEST_CODE_GROUP_DETAIL = 13;
    private static final int REQUEST_CODE_CONTEXT_MENU = 14;
    private static final int REQUEST_CODE_SELECT_AT_USER = 15;


    private static final int MESSAGE_TYPE_SENT_VOICE_CALL = 1;
    private static final int MESSAGE_TYPE_RECV_VOICE_CALL = 2;
    private static final int MESSAGE_TYPE_SENT_VIDEO_CALL = 3;
    private static final int MESSAGE_TYPE_RECV_VIDEO_CALL = 4;
    private static final int MESSAGE_TYPE_RECALL = 9;
    //red packet code : 红包功能使用的常量
    private static final int MESSAGE_TYPE_RECV_RED_PACKET = 5;
    private static final int MESSAGE_TYPE_SEND_RED_PACKET = 6;
    private static final int MESSAGE_TYPE_SEND_RED_PACKET_ACK = 7;
    private static final int MESSAGE_TYPE_RECV_RED_PACKET_ACK = 8;
    private static final int MESSAGE_TYPE_RECV_RANDOM = 11;
    private static final int MESSAGE_TYPE_SEND_RANDOM = 12;
    private static final int ITEM_RED_PACKET = 16;
    private DialogGroupMembers mDialogGroupMembers;

    //end of red packet code


    /**
     * if it is chatBot
     */
    public ChatView(@NonNull ThemedReactContext context) {
        super(context);
    }

    @Override
    protected void onAttachedToWindow() {
        isRoaming = ChatHelper.getInstance().getModel().isMsgRoaming();
        super.onAttachedToWindow();
        Messenger.getInstance(Messenger.LOADED).send();
        if (!EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().register(this);
    }

    @Override
    public void setUpView() {
        setChatFragmentHelper(this);
        super.setUpView();
//        if (chatType == EaseConstant.CHATTYPE_GROUP) {
//            inputMenu.getPrimaryMenu().getEditText().addTextChangedListener(new TextWatcher() {
//
//                @Override
//                public void onTextChanged(CharSequence s, int start, int before, int count) {
//                    if (count == 1 && "@".equals(String.valueOf(s.charAt(start)))) {
//                        startActivityForResult(new Intent(getActivity(), PickAtUserActivity.class).
//                                putExtra("groupId", toChatUsername), REQUEST_CODE_SELECT_AT_USER);
//                    }
//                }
//
//                @Override
//                public void beforeTextChanged(CharSequence s, int start, int count, int after) {
//
//                }
//
//                @Override
//                public void afterTextChanged(Editable s) {
//
//                }
//            });
//        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        if (EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().unregister(this);
    }

    @Override
    public void registerExtendMenuItem() {
        if (chatType == EaseConstantSub.CHATTYPE_SINGLE) {
            super.registerExtendMenuItem();
            inputMenu.registerExtendMenuItem(R.string.attach_voice_call, R.drawable.em_chat_voice_call_selector, ITEM_VOICE_CALL, extendMenuItemClickListener);
        } else {
            inputMenu.registerExtendMenuItem(R.string.attach_voice_call, R.drawable.em_chat_voice_call_selector, ITEM_VOICE_CALL, extendMenuItemClickListener);
            inputMenu.registerExtendMenuItem("快捷输入", R.drawable.ic_quick_reply, ITEM_QUICK_REPLY, extendMenuItemClickListener);
        }
    }

    @Subscribe
    public void onEventMainThread(BusShareLocBean locBean) {
        sendLocationMessage(locBean.latitude, locBean.longitude, locBean.address);
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
        if (requestCode == REQUEST_CODE_CONTEXT_MENU) {
            switch (resultCode) {
                case ContextMenuActivity.RESULT_CODE_COPY: // copy
                    clipboard.setPrimaryClip(ClipData.newPlainText(null,
                            ((EMTextMessageBody) contextMenuMessage.getBody()).getMessage()));
                    break;
                case ContextMenuActivity.RESULT_CODE_DELETE: // delete
                    conversation.removeMessage(contextMenuMessage.getMsgId());
                    messageList.refresh();
                    break;

                case ContextMenuActivity.RESULT_CODE_FORWARD: // forward
//                    Intent intent = new Intent(mContext.getCurrentActivity(), ForwardMessageActivity.class);
//                    intent.putExtra("forward_msg_id", contextMenuMessage.getMsgId());
//                    startActivity(intent);
                    break;
                case ContextMenuActivity.RESULT_CODE_RECALL://recall
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                EMMessage msgNotification = EMMessage.createTxtSendMessage(" ", contextMenuMessage.getTo());
                                EMTextMessageBody txtBody = new EMTextMessageBody(getResources().getString(R.string.msg_recall_by_self));
                                msgNotification.addBody(txtBody);
                                msgNotification.setMsgTime(contextMenuMessage.getMsgTime());
                                msgNotification.setLocalTime(contextMenuMessage.getMsgTime());
                                msgNotification.setAttribute(EaseConstantSub.MESSAGE_TYPE_RECALL, true);
                                EMClient.getInstance().chatManager().recallMessage(contextMenuMessage);
                                EMClient.getInstance().chatManager().saveMessage(msgNotification);
                                messageList.refresh();
                            } catch (final HyphenateException e) {
                                e.printStackTrace();
                                mContext.getCurrentActivity().runOnUiThread(new Runnable() {
                                    public void run() {
                                        Toast.makeText(mContext, e.getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                });
                            }
                        }
                    }).start();
                    break;

                default:
                    break;
            }
        }
        if (resultCode == Activity.RESULT_OK) {
            switch (requestCode) {
                case REQUEST_CODE_SELECT_VIDEO: //send the video
                    if (data != null) {
                        int duration = data.getIntExtra("dur", 0);
                        String videoPath = data.getStringExtra("path");
                        File file = new File(PathUtil.getInstance().getImagePath(), "thvideo" + System.currentTimeMillis());
//                        try {
//                            FileOutputStream fos = new FileOutputStream(file);
//                            Bitmap ThumbBitmap = ThumbnailUtils.createVideoThumbnail(videoPath, 3);
//                            ThumbBitmap.compress(Bitmap.CompressFormat.JPEG, 100, fos);
//                            fos.close();
//                            sendVideoMessage(videoPath, file.getAbsolutePath(), duration);
//                        } catch (Exception e) {
//                            e.printStackTrace();
//                        }
                    }
                    break;
                case REQUEST_CODE_SELECT_FILE: //send the file
//                    if (data != null) {
//                        Uri uri = data.getData();
//                        if (uri != null) {
//                            sendFileByUri(uri);
//                        }
//                    }
                    break;
                case REQUEST_CODE_SELECT_AT_USER:
//                    if (data != null) {
//                        String username = data.getStringExtra("username");
//                        inputAtUsername(username, false);
//                    }
                    break;
                default:
                    break;
            }
        }

    }

    @Override
    public void onSetMessageAttributes(EMMessage message) {

    }

    @Override
    public void onEnterToChatDetails() {
//        if (chatType == EaseConstantSub.CHATTYPE_GROUP) {
//            EMGroup group = EMClient.getInstance().groupManager().getGroup(toChatUsername);
//            if (group == null) {
//                Toast.makeText(getActivity(), R.string.gorup_not_found, Toast.LENGTH_SHORT).show();
//                return;
//            }
//            startActivityForResult((new Intent(getActivity(), GroupDetailActivity.class)
//                    .putExtra("groupId", toChatUsername)), REQUEST_CODE_GROUP_DETAIL);
//
//        }
    }

    @Override
    public void onAvatarClick(String username) {
        Messenger.getInstance(Messenger.TO_USER_DETAIL).putString(Const.HX_ID, username).send();
    }

    @Override
    public void onAvatarLongClick(String username) {

    }

    @Override
    public boolean onMessageBubbleClick(EMMessage message) {
        if (message.getType() == EMMessage.Type.LOCATION) {
            EMLocationMessageBody locBody = (EMLocationMessageBody) message.getBody();

            ShareSearch shareSearch = new ShareSearch(MyApplication.getContext());
            shareSearch.setOnShareSearchListener(new ShareSearch.OnShareSearchListener() {
                @Override
                public void onPoiShareUrlSearched(String s, int i) {

                }

                @Override
                public void onLocationShareUrlSearched(String s, int errorCode) {
                    if (errorCode == AMapException.CODE_AMAP_SUCCESS) {
                        final Intent intent = new Intent();
                        intent.setAction(Intent.ACTION_VIEW);
                        intent.setData(Uri.parse(s));
                        if (intent.resolveActivity(MyApplication.getContext().getPackageManager()) != null) {
                            final ComponentName componentName = intent.resolveActivity(MyApplication.getContext().getPackageManager());
                            Log.e(TAG, "componentName = " + componentName.getClassName());
//                            startActivity(Intent.createChooser(intent, "请选择浏览器"));
                            mContext.startActivity(intent);
                        } else {
                            Toast.makeText(MyApplication.getContext().getApplicationContext(), "没有匹配的程序", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        ToastUtils.showToast("error:" + errorCode);
                    }
                }

                @Override
                public void onNaviShareUrlSearched(String s, int i) {

                }

                @Override
                public void onBusRouteShareUrlSearched(String s, int i) {

                }

                @Override
                public void onWalkRouteShareUrlSearched(String s, int i) {

                }

                @Override
                public void onDrivingRouteShareUrlSearched(String s, int i) {

                }
            });
            shareSearch.searchLocationShareUrlAsyn(new LatLonSharePoint(locBody.getLatitude(), locBody.getLongitude(), locBody.getAddress()));
            return true;
        }
        return false;
    }

    @Override
    public void onMessageBubbleLongClick(EMMessage message) {
        mContext.getCurrentActivity().startActivityForResult((new Intent(mContext.getCurrentActivity(), ContextMenuActivity.class))
                        .putExtra("searchMessage", message)
                        .putExtra("ischatroom", chatType == EaseConstant.CHATTYPE_CHATROOM),
                REQUEST_CODE_CONTEXT_MENU);
    }

    @Override
    public boolean onExtendMenuItemClick(int itemId, View view) {
        switch (itemId) {
            case ITEM_VIDEO:
//                Intent intent = new Intent(getActivity(), ImageGridActivity.class);
//                startActivityForResult(intent, REQUEST_CODE_SELECT_VIDEO);
                break;
            case ITEM_FILE: //file
                selectFileFromLocal();
                break;
            case ITEM_VOICE_CALL:
                startVoiceCall();
                break;
            case ITEM_VIDEO_CALL:
//                startVideoCall();
                break;
            case ITEM_QUICK_REPLY:
                inputMenu.showQuickReply();
                break;
            case ITEM_LOCATION:
                WritableMap event = Arguments.createMap();
                event.putString("action", "to_location_share_view");
                mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("event", event);
                break;

        }
        //keep exist extend menu
        return false;
    }


    protected void sendLocationMessage(double latitude, double longitude, String locationAddress) {
        EMMessage message = EMMessage.createLocationSendMessage(latitude, longitude, locationAddress, toChatUsername);
        sendMessage(message);
    }

    protected void startVoiceCall() {
        if (!EMClient.getInstance().isConnected()) {
            Toast.makeText(mContext, R.string.not_connect_to_server, Toast.LENGTH_SHORT).show();
        } else {
            if (chatType == EaseConstant.CHATTYPE_GROUP) {
                if (mDialogGroupMembers == null)
                    mDialogGroupMembers = new DialogGroupMembers(mContext.getCurrentActivity(), new DialogGroupMembers.OnMemberSelecteListener() {
                        @Override
                        public void onMemberSelect(String hxId) {
                            startCall(hxId, toChatUsername);
                        }
                    });
                mDialogGroupMembers.show(toChatUsername);

            } else if (chatType == EaseConstant.CHATTYPE_SINGLE) {
                startCall(toChatUsername, null);
            }
        }
    }

    private void startCall(String toUserName, String groupId) {
        mContext.getCurrentActivity().startActivity(new Intent(mContext.getCurrentActivity(), VoiceCallActivity.class)
                .putExtra("username", toUserName)
                .putExtra("group_id", groupId)
                .putExtra("isComingCall", false));
        // voiceCallBtn.setEnabled(false);
        inputMenu.hideExtendMenuContainer();
    }

    protected void selectFileFromLocal() {
        Intent intent = null;
        if (Build.VERSION.SDK_INT < 19) { //api 19 and later, we can't use this way, demo just select from images
            intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("*/*");
            intent.addCategory(Intent.CATEGORY_OPENABLE);

        } else {
            intent = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        }
        mContext.getCurrentActivity().startActivityForResult(intent, REQUEST_CODE_SELECT_FILE);
    }

    @Override
    public EaseCustomChatRowProvider onSetCustomChatRowProvider() {
        return new CustomChatRowProvider();
    }

    private final class CustomChatRowProvider implements EaseCustomChatRowProvider {
        @Override
        public int getCustomChatRowTypeCount() {
            //here the number is the searchMessage type in EMMessage::Type
            //which is used to count the number of different chat row
            return 11;
        }

        @Override
        public int getCustomChatRowType(EMMessage message) {
            if (message.getType() == EMMessage.Type.TXT) {
                //voice call
                if (message.getBooleanAttribute(EaseConstantSub.MESSAGE_ATTR_IS_VOICE_CALL, false)) {
                    return message.direct() == EMMessage.Direct.RECEIVE ? MESSAGE_TYPE_RECV_VOICE_CALL : MESSAGE_TYPE_SENT_VOICE_CALL;
                } else if (message.getBooleanAttribute(EaseConstantSub.MESSAGE_ATTR_IS_VIDEO_CALL, false)) {
                    //video call
                    return message.direct() == EMMessage.Direct.RECEIVE ? MESSAGE_TYPE_RECV_VIDEO_CALL : MESSAGE_TYPE_SENT_VIDEO_CALL;
                }
                //messagee recall
                else if (message.getBooleanAttribute(EaseConstantSub.MESSAGE_TYPE_RECALL, false)) {
                    return MESSAGE_TYPE_RECALL;
                }
            }
            return 0;
        }

        @Override
        public EaseChatRow getCustomChatRow(EMMessage message, int position, BaseAdapter adapter) {
            if (message.getType() == EMMessage.Type.TXT) {
                // voice call or video call
                if (message.getBooleanAttribute(EaseConstantSub.MESSAGE_ATTR_IS_VOICE_CALL, false) ||
                        message.getBooleanAttribute(EaseConstantSub.MESSAGE_ATTR_IS_VIDEO_CALL, false)) {
                    return new ChatRowVoiceCall(mContext.getCurrentActivity(), message, position, adapter);
                }
                //recall searchMessage
                else if (message.getBooleanAttribute(EaseConstantSub.MESSAGE_TYPE_RECALL, false)) {
                    return new EaseChatRowRecall(mContext.getCurrentActivity(), message, position, adapter);
                } else if (message.getBooleanAttribute(EaseConstantSub.MESSAGE_TYPE_SHARE, false)) {
                    return new ChatRowShare(mContext.getCurrentActivity(), message, position, adapter);
                }
            }
            return null;
        }

    }
}
