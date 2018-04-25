package com.project.chat;

import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;
import android.os.Message;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.hyphenate.EMCallBack;
import com.hyphenate.EMConnectionListener;
import com.hyphenate.EMError;
import com.hyphenate.EMGroupChangeListener;
import com.hyphenate.EMMessageListener;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMCmdMessageBody;
import com.hyphenate.chat.EMGroup;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMMucSharedFile;
import com.hyphenate.chat.EMOptions;
import com.hyphenate.chat.EMTextMessageBody;
import com.hyphenate.util.EMLog;
import com.hyphenate.util.NetUtils;
import com.project.MainActivity;
import com.project.MyApplication;
import com.project.R;
import com.project.chat.activity.VoiceCallActivity;
import com.project.chat.db.DemoDBManager;
import com.project.chat.db.InviteMessgeDao;
import com.project.chat.domain.EaseEmojicon;
import com.project.chat.domain.EaseEmojiconGroupEntity;
import com.project.chat.domain.EaseUser;
import com.project.chat.domain.EmojiconExampleGroupData;
import com.project.chat.domain.GroupChatExtBean;
import com.project.chat.domain.InviteMessage;
import com.project.chat.model.DemoModel;
import com.project.chat.model.EaseNotifier;
import com.project.chat.receiver.CallReceiver;
import com.project.chat.util.EaseCommonUtils;
import com.project.chat.util.PreferenceManager;
import com.project.chat.util.StrangersCachUtil;
import com.project.config.Const;
import com.project.util.Json_U;
import com.project.util.SPUtil;
import com.project.util.ToastUtils;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.project.util.ToastUtils.showToast;

/**
 * Created by sshss on 2017/12/21.
 */

public class ChatHelper {
    private static final String TAG = "ChatHelper";
    private static MyApplication mContext;
    private static ChatHelper sInstance;
    private LocalBroadcastManager broadcastManager;
    private CallReceiver callReceiver;
    public boolean isVoiceCalling;
    private EMConnectionListener connectionListener;
    private boolean isGroupAndContactListenerRegisted;
    private InviteMessgeDao inviteMessgeDao;
    private EaseUI easeUI;
    private EMMessageListener messageListener;
    private DemoModel demoModel;

    private ChatHelper() {

    }

    public static ChatHelper getInstance() {
        if (sInstance == null)
            sInstance = new ChatHelper();
        return sInstance;
    }

    public void init(MyApplication context) {
        mContext = context;
        demoModel = new DemoModel(mContext);
        EMOptions options = initChatOptions();
        options.setAutoLogin(true);
        easeUI = EaseUI.getInstance();
        easeUI.init(context, options);
        setEaseUIProviders();
        EMClient.getInstance().init(context, options);
        EMClient.getInstance().setDebugMode(true);

        PreferenceManager.init(context);
        setCallOptions();

        int minBitRate = PreferenceManager.getInstance().getCallMinVideoKbps();
        if (minBitRate != -1) {
            EMClient.getInstance().callManager().getCallOptions().setMinVideoKbps(minBitRate);
        }

        // max video kbps
        int maxBitRate = PreferenceManager.getInstance().getCallMaxVideoKbps();
        if (maxBitRate != -1) {
            EMClient.getInstance().callManager().getCallOptions().setMaxVideoKbps(maxBitRate);
        }

        // max frame rate
        int maxFrameRate = PreferenceManager.getInstance().getCallMaxFrameRate();
        if (maxFrameRate != -1) {
            EMClient.getInstance().callManager().getCallOptions().setMaxVideoFrameRate(maxFrameRate);
        }

        // audio sample rate
        int audioSampleRate = PreferenceManager.getInstance().getCallAudioSampleRate();
        if (audioSampleRate != -1) {
            EMClient.getInstance().callManager().getCallOptions().setAudioSampleRate(audioSampleRate);
        }

        setGlobalListeners();
        broadcastManager = LocalBroadcastManager.getInstance(mContext);

    }


    private void setEaseUIProviders() {
        easeUI.setUserProfileProvider(new EaseUI.EaseUserProfileProvider() {

            @Override
            public EaseUser getUser(String username) {
                return getUserInfo(username);
            }
        });

        easeUI.setSettingsProvider(new EaseUI.EaseSettingsProvider() {

            @Override
            public boolean isSpeakerOpened() {
                return demoModel.getSettingMsgSpeaker();
            }

            @Override
            public boolean isMsgVibrateAllowed(EMMessage message) {
                Boolean silentMode = SPUtil.getBoolean(Const.CHAT_SILENT_MODE, false);
                return demoModel.getSettingMsgVibrate() && !silentMode;
            }

            @Override
            public boolean isMsgSoundAllowed(EMMessage message) {
                Boolean silentMode = SPUtil.getBoolean(Const.CHAT_SILENT_MODE, false);
                return demoModel.getSettingMsgSound() && !silentMode;
            }

            @Override
            public boolean isMsgNotifyAllowed(EMMessage message) {
                if (message == null) {
                    return demoModel.getSettingMsgNotification();
                }
                if (!demoModel.getSettingMsgNotification()) {
                    return false;
                } else {
                    String chatUsename = null;
                    List<String> notNotifyIds = null;
                    // get user or group id which was blocked to show searchMessage notifications
                    if (message.getChatType() == EMMessage.ChatType.Chat) {
                        chatUsename = message.getFrom();
                        notNotifyIds = demoModel.getDisabledIds();
                    } else {
                        chatUsename = message.getTo();
                        notNotifyIds = demoModel.getDisabledGroups();
                    }

                    if (notNotifyIds == null || !notNotifyIds.contains(chatUsename)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        });
        easeUI.setEmojiconInfoProvider(new EaseUI.EaseEmojiconInfoProvider() {

            @Override
            public EaseEmojicon getEmojiconInfo(String emojiconIdentityCode) {
                EaseEmojiconGroupEntity data = EmojiconExampleGroupData.getData();
                for (EaseEmojicon emojicon : data.getEmojiconList()) {
                    if (emojicon.getIdentityCode().equals(emojiconIdentityCode)) {
                        return emojicon;
                    }
                }
                return null;
            }

            @Override
            public Map<String, Object> getTextEmojiconMapping() {
                return null;
            }
        });

        easeUI.getNotifier().setNotificationInfoProvider(new EaseNotifier.EaseNotificationInfoProvider() {

            @Override
            public String getTitle(EMMessage message) {
                //you can update title here
                return null;
            }

            @Override
            public int getSmallIcon(EMMessage message) {
                //you can update icon here
                return R.mipmap.ic_logo;
            }

            @Override
            public String getDisplayedText(EMMessage message) {
                // be used on notification bar, different text according the searchMessage type.
                EMMessage.Type type = message.getType();
                if (type == EMMessage.Type.CMD) {
                    EMCmdMessageBody body = (EMCmdMessageBody) message.getBody();
                    switch (body.action()) {
                        case EaseConstant.ACTION_ATTENTION:
                            String from = message.getStringAttribute(EaseConstant.USER_NICK_FROM, "");
                            return from + ":关注了你。";
                        case EaseConstant.ACTION_AT:
                            return "";
                    }
                } else {
                    String ticker = EaseCommonUtils.getMessageDigest(message, mContext);
                    if (type == EMMessage.Type.TXT) {
                        ticker = ticker.replaceAll("\\[.{2,3}\\]", "[表情]");
                    }
                    EaseUser user = getUserInfo(message.getFrom());
                    if (user != null) {
                        return user.getNick() + ": " + ticker;
                    } else {
                        return message.getFrom() + ": " + ticker;
                    }
                }
                return null;
            }

            @Override
            public String getLatestText(EMMessage message, int fromUsersNum, int messageNum) {
                // here you can customize the text.
                // return fromUsersNum + "contacts send " + messageNum + "messages to you";

                EMMessage.Type type = message.getType();
                if (type == EMMessage.Type.CMD) {
                    EMCmdMessageBody body = (EMCmdMessageBody) message.getBody();
                    switch (body.action()) {
                        case EaseConstant.ACTION_ATTENTION:
                            String from = message.getStringAttribute(EaseConstant.USER_NICK_FROM, "");
                            return from + ":关注了你。";
                        case EaseConstant.ACTION_AT:
                            return "";
                    }
                }
                EaseUser user = getUserInfo(message.getFrom());
                String notifyText = "";
                if (user != null) {
                    notifyText = user.getNick() + "：";
                }
                switch (message.getType()) {
                    case TXT:
                        notifyText += ((EMTextMessageBody) message.getBody()).getMessage();
                        break;
                    case IMAGE:
                        return null;
                    case VOICE:
                        return null;
                    case LOCATION:
                        return null;
                    case VIDEO:
                        return null;
                    case FILE:
                        return null;
                }
                return notifyText;
            }

            @Override
            public Intent getLaunchIntent(EMMessage message) {
                // you can set what activity you want display when user click the notification
                Intent intent = new Intent(mContext, MainActivity.class);
                // open calling activity if there is call
//                if (isVideoCalling) {
//                    intent = new Intent(mContext, VideoCallActivity.class);
//                } else
                if (isVoiceCalling) {
                    intent = new Intent(mContext, VoiceCallActivity.class);
                } else {
                    EMMessage.ChatType chatType = message.getChatType();
                    if (chatType == EMMessage.ChatType.Chat) { // single chat searchMessage
                        intent.putExtra("userId", message.getFrom());
                        intent.putExtra("chatType", EaseConstantSub.CHATTYPE_SINGLE);
                    } else { // group chat searchMessage
                        // searchMessage.getTo() is the group id
                        intent.putExtra("userId", message.getTo());
                        if (chatType == EMMessage.ChatType.GroupChat) {
                            intent.putExtra(EaseConstantSub.IS_ORDER_GROUP_CHAT, message.getBooleanAttribute(EaseConstantSub.IS_ORDER_GROUP_CHAT, false));
                            intent.putExtra("chatType", EaseConstantSub.CHATTYPE_GROUP);
                            EMGroup group = EMClient.getInstance().groupManager().getGroup(message.conversationId());
                            String description = group.getDescription();
                            System.out.println("group description: " + description);
                            GroupChatExtBean bean = Json_U.fromJson(description, GroupChatExtBean.class);
                            if (bean.groupType == EaseConstant.ORDER_CHAT) {
                                intent.putExtra("orderId", bean.orderId);
                            }
                        } else {
                            intent.putExtra("chatType", EaseConstantSub.CHATTYPE_CHATROOM);
                        }
                    }
                }
                if (message.getType() == EMMessage.Type.CMD) {
                    EMCmdMessageBody body = (EMCmdMessageBody) message.getBody();
                    switch (body.action()) {
                        case EaseConstant.ACTION_AT:
                            break;
                        case EaseConstant.ACTION_ATTENTION:
//                            intent.setClass(mContext, NewFriendsMsgActivity.class);
//                            intent.putExtra(Const.INDEX, 1);
                            break;
                        case EaseConstant.ACTION_SUPPORT:
                            break;
                    }
                }
//
//                if (message.getBody() instanceof EMCmdMessageBody) {
//                    String action = ((EMCmdMessageBody) message.getBody()).action();
//
//
//                    if (TextUtils.equals(action, Const.STATE_ACTION_AT) ||
//                            TextUtils.equals(action, Const.STATE_ACTION_SUPPORT)) {
//                        intent.setClass(mContext, StateHelperActivity.class);
//                    }
//                }
                return intent;
            }
        });

    }

    private EaseUser getUserInfo(String username) {
        EaseUser user = null;
        if (username.equals(EMClient.getInstance().getCurrentUser())) {
            user = new EaseUser(username);
            user.setAvatar(SPUtil.getString(Const.USER_HEADER, ""));
            user.setNickname(SPUtil.getString(Const.USER_NICK, ""));
        }
        if (user == null) {
            user = StrangersCachUtil.getUser(MyApplication.getContext(), username);
        }
        // if user is not in your contacts, set inital letter for him/her
        if (user == null) {
            user = new EaseUser(username);
        }
        EaseCommonUtils.setUserInitialLetter(user);
        return user;
    }

    private void setGlobalListeners() {
        IntentFilter callFilter = new IntentFilter(EMClient.getInstance().callManager().getIncomingCallBroadcastAction());
        if (callReceiver == null) {
            callReceiver = new CallReceiver();
        }
        connectionListener = new EMConnectionListener() {
            @Override
            public void onDisconnected(int error) {
                EMLog.d("global listener", "onDisconnect" + error);
                if (error == EMError.USER_REMOVED) {
                    onUserException(EaseConstantSub.ACCOUNT_REMOVED);
                } else if (error == EMError.USER_LOGIN_ANOTHER_DEVICE) {
                    onUserException(EaseConstantSub.ACCOUNT_CONFLICT);
                } else if (error == EMError.SERVER_SERVICE_RESTRICTED) {
                    onUserException(EaseConstantSub.ACCOUNT_FORBIDDEN);
                } else if (error == EMError.USER_KICKED_BY_CHANGE_PASSWORD) {
                    onUserException(EaseConstantSub.ACCOUNT_KICKED_BY_CHANGE_PASSWORD);
                } else if (error == EMError.USER_KICKED_BY_OTHER_DEVICE) {
                    onUserException(EaseConstantSub.ACCOUNT_KICKED_BY_OTHER_DEVICE);
                }

                if (error == EMError.USER_REMOVED) {
                    System.out.println("帐号已经被移除");
                } else if (error == EMError.USER_LOGIN_ANOTHER_DEVICE) {
                    System.out.println("显示帐号在其他设备登录");
                } else {
                    if (NetUtils.hasNetwork(MyApplication.getContext())) {
                        System.out.println("连接不到聊天服务器");
                    } else {
                        System.out.println("当前网络不可用，请检查网络设置");
                    }
                }
            }

            @Override
            public void onConnected() {
                System.out.println("连接聊天服务器成功");
                // in case group and contact were already synced, we supposed to notify sdk we are ready to receive the events
//                if (isGroupsSyncedWithServer && isContactsSyncedWithServer) {
//                    EMLog.d(TAG, "group and contact already synced with servre");
//                } else {
//                    if (!isGroupsSyncedWithServer) {
//                        asyncFetchGroupsFromServer(null);
//                    }
//
//                    if (!isContactsSyncedWithServer) {
//                        asyncFetchContactsFromServer(null);
//                    }
//
//                    if (!isBlackListSyncedWithServer) {
//                        asyncFetchBlackListFromServer(null);
//                    }
//                }
            }
        };
        //register incoming call receiver
        mContext.registerReceiver(callReceiver, callFilter);
        //register connection listener
        EMClient.getInstance().addConnectionListener(connectionListener);
        //register group and contact event listener
        registerGroupAndContactListener();
        //register searchMessage event listener
        registerMessageListener();
    }

    protected void registerMessageListener() {
        messageListener = new EMMessageListener() {
            private BroadcastReceiver broadCastReceiver = null;

            @Override
            public void onMessageReceived(List<EMMessage> messages) {
                for (EMMessage message : messages) {
                    EMLog.d(TAG, "onMessageReceived id : " + message.getMsgId());
                    // in background, do not refresh UI, notify it in notification bar

                    //不是好友
                    String from = message.getFrom();
                    try {
                        String avatar = message.getStringAttribute(EaseConstant.USER_HEAD);
                        String nick = message.getStringAttribute(EaseConstant.USER_NICK);

                        StrangersCachUtil.putUser(MyApplication.getContext(), from, nick, avatar);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    if (!easeUI.hasForegroundActivies() && !message.getFrom().equals(getCurrentUsernName())) {
                        getNotifier().onNewMsg(message);
                    }
                }
            }

            @Override
            public void onCmdMessageReceived(List<EMMessage> messages) {
                for (EMMessage message : messages) {
                    EMLog.d(TAG, "receive command searchMessage");
                    EMCmdMessageBody cmdMsgBody = (EMCmdMessageBody) message.getBody();
                    String action = cmdMsgBody.action();//获取自定义action

//                    switch (action) {
//                        case EaseConstant.ACTION_ATTENTION:
//                            Map<String, EaseUser> contactList = getContactList();
//                            String fromId = message.getFrom();
//                            if (contactList.get(fromId) == null) {
////                                    if (!easeUI.hasForegroundActivies()) {
//                                getNotifier().onNewMsg(message);
////                                    }
//                            }
//                            break;
//                    }
//                    if (action.equals("__Call_ReqP2P_ConferencePattern")) {
//                        String title = searchMessage.getStringAttribute("em_apns_ext", "conference call");
//                        Toast.makeText(mContext, title, Toast.LENGTH_LONG).show();
//                    }


//                    StateHelperUtil.getInstance().putCmdMessage(message);
                    EMLog.d(TAG, String.format("Command：action:%s,searchMessage:%s", action, message.toString()));
                }
            }

            @Override
            public void onMessageRead(List<EMMessage> messages) {
            }

            @Override
            public void onMessageDelivered(List<EMMessage> message) {
            }

            @Override
            public void onMessageRecalled(List<EMMessage> messages) {
                for (EMMessage msg : messages) {
                    EMMessage msgNotification = EMMessage.createReceiveMessage(EMMessage.Type.TXT);
                    EMTextMessageBody txtBody = new EMTextMessageBody(String.format(mContext.getString(R.string.msg_recall_by_user), msg.getFrom()));
                    msgNotification.addBody(txtBody);
                    msgNotification.setFrom(msg.getFrom());
                    msgNotification.setTo(msg.getTo());
                    msgNotification.setUnread(false);
                    msgNotification.setMsgTime(msg.getMsgTime());
                    msgNotification.setLocalTime(msg.getMsgTime());
                    msgNotification.setChatType(msg.getChatType());
                    msgNotification.setAttribute(EaseConstantSub.MESSAGE_TYPE_RECALL, true);
                    EMClient.getInstance().chatManager().saveMessage(msgNotification);
                }
            }

            @Override
            public void onMessageChanged(EMMessage message, Object change) {
                EMLog.d(TAG, "change:");
                EMLog.d(TAG, "change:" + change);
            }
        }

        ;

        EMClient.getInstance().

                chatManager().

                addMessageListener(messageListener);
    }

    public void registerGroupAndContactListener() {
        if (!isGroupAndContactListenerRegisted) {
            EMClient.getInstance().groupManager().addGroupChangeListener(new MyGroupChangeListener());
//            EMClient.getInstance().contactManager().setContactListener(new MyContactListener());
//            EMClient.getInstance().addMultiDeviceListener(new MyMultiDeviceListener());
            isGroupAndContactListenerRegisted = true;
        }
    }

    private Handler toastHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            String info = (String) msg.obj;
            ToastUtils.showToast(info);
        }
    };

    protected void onUserException(final String exception) {
        Intent intent = new Intent(mContext, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        intent.putExtra(exception, true);
        mContext.startActivity(intent);
        Message obtain = Message.obtain();
        obtain.obj = exception;
        toastHandler.sendMessage(obtain);
    }

    private void setCallOptions() {
        // min video kbps
        int minBitRate = PreferenceManager.getInstance().getCallMinVideoKbps();
        if (minBitRate != -1) {
            EMClient.getInstance().callManager().getCallOptions().setMinVideoKbps(minBitRate);
        }

        // max video kbps
        int maxBitRate = PreferenceManager.getInstance().getCallMaxVideoKbps();
        if (maxBitRate != -1) {
            EMClient.getInstance().callManager().getCallOptions().setMaxVideoKbps(maxBitRate);
        }

        // max frame rate
        int maxFrameRate = PreferenceManager.getInstance().getCallMaxFrameRate();
        if (maxFrameRate != -1) {
            EMClient.getInstance().callManager().getCallOptions().setMaxVideoFrameRate(maxFrameRate);
        }

        // audio sample rate
        int audioSampleRate = PreferenceManager.getInstance().getCallAudioSampleRate();
        if (audioSampleRate != -1) {
            EMClient.getInstance().callManager().getCallOptions().setAudioSampleRate(audioSampleRate);
        }

        /**
         * This function is only meaningful when your app need recording
         * If not, remove it.
         * This function need be called before the video stream started, so we set it in onCreate function.
         * This method will set the preferred video record encoding codec.
         * Using default encoding format, recorded file may not be played by mobile player.
         */
        //EMClient.getInstance().callManager().getVideoCallHelper().setPreferMovFormatEnable(true);

        // resolution
        String resolution = PreferenceManager.getInstance().getCallBackCameraResolution();
        if (resolution.equals("")) {
            resolution = PreferenceManager.getInstance().getCallFrontCameraResolution();
        }
        String[] wh = resolution.split("x");
        if (wh.length == 2) {
            try {
                EMClient.getInstance().callManager().getCallOptions().setVideoResolution(new Integer(wh[0]).intValue(), new Integer(wh[1]).intValue());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // enabled fixed sample rate
        boolean enableFixSampleRate = PreferenceManager.getInstance().isCallFixedVideoResolution();
        EMClient.getInstance().callManager().getCallOptions().enableFixedVideoResolution(enableFixSampleRate);

        // Offline call push
        EMClient.getInstance().callManager().getCallOptions().setIsSendPushIfOffline(true);
    }

    private EMOptions initChatOptions() {

        EMOptions options = new EMOptions();
        options.setAutoLogin(true);
        // set if accept the invitation automatically
        options.setAcceptInvitationAlways(false);
        // set if you need read ack
        options.setRequireAck(true);
        // set if you need delivery ack
        options.setRequireDeliveryAck(false);
        options.allowChatroomOwnerLeave(true);
        options.setDeleteMessagesAsExitGroup(true);
        //自动接受群邀请
        options.setAutoAcceptGroupInvitation(true);
        return options;
    }

    public boolean isLoggedIn() {
        return EMClient.getInstance().isLoggedInBefore();
    }

    public String getCurrentUsernName() {
        return SPUtil.getString(Const.HX_ID, "");
    }

    public EaseNotifier getNotifier() {
        return easeUI.getNotifier();
    }

    private void notifyNewInviteMessage(InviteMessage msg) {
        if (inviteMessgeDao == null) {
            inviteMessgeDao = new InviteMessgeDao(mContext);
        }
        inviteMessgeDao.saveMessage(msg);
        //increase the unread searchMessage count
        inviteMessgeDao.saveUnreadMessageCount(1);
        // notify there is new searchMessage
        getNotifier().vibrateAndPlayTone(null);
    }

    public DemoModel getModel() {
        return demoModel;
    }


    public void logout(boolean unbindDeviceToken, final EMCallBack callback) {
        endCall();
        Log.d(TAG, "logout: " + unbindDeviceToken);
        EMClient.getInstance().logout(unbindDeviceToken, new EMCallBack() {

            @Override
            public void onSuccess() {
                Log.d(TAG, "logout: onSuccess");
                reset();
                if (callback != null) {
                    callback.onSuccess();
                }

            }

            @Override
            public void onProgress(int progress, String status) {
                if (callback != null) {
                    callback.onProgress(progress, status);
                }
            }

            @Override
            public void onError(int code, String error) {
                Log.d(TAG, "logout: onSuccess");
                reset();
                if (callback != null) {
                    callback.onError(code, error);
                }
            }
        });
    }

    synchronized void reset() {

        demoModel.setGroupsSynced(false);
        demoModel.setContactSynced(false);
        demoModel.setBlacklistSynced(false);


        isGroupAndContactListenerRegisted = false;

        DemoDBManager.getInstance().closeDB();
    }

    void endCall() {
        try {
            EMClient.getInstance().callManager().endCall();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    class MyGroupChangeListener implements EMGroupChangeListener {

        @Override
        public void onInvitationReceived(String groupId, String groupName, String inviter, String reason) {

            new InviteMessgeDao(mContext).deleteMessage(groupId);

            // user invite you to join group
            InviteMessage msg = new InviteMessage();
            msg.setFrom(groupId);
            msg.setTime(System.currentTimeMillis());
            msg.setGroupId(groupId);
            msg.setGroupName(groupName);
            msg.setReason(reason);
            msg.setGroupInviter(inviter);
            msg.setStatus(InviteMessage.InviteMessageStatus.GROUPINVITATION);
            notifyNewInviteMessage(msg);
            broadcastManager.sendBroadcast(new Intent(EaseConstantSub.ACTION_GROUP_CHANAGED));
        }

        @Override
        public void onInvitationAccepted(String groupId, String invitee, String reason) {

            new InviteMessgeDao(mContext).deleteMessage(groupId);

            //user accept your invitation
            boolean hasGroup = false;
            EMGroup _group = null;
            for (EMGroup group : EMClient.getInstance().groupManager().getAllGroups()) {
                if (group.getGroupId().equals(groupId)) {
                    hasGroup = true;
                    _group = group;
                    break;
                }
            }
            if (!hasGroup)
                return;

            InviteMessage msg = new InviteMessage();
            msg.setFrom(groupId);
            msg.setTime(System.currentTimeMillis());
            msg.setGroupId(groupId);
            msg.setGroupName(_group == null ? groupId : _group.getGroupName());
            msg.setReason(reason);
            msg.setGroupInviter(invitee);
            showToast(invitee + "Accept to join the group：" + _group == null ? groupId : _group.getGroupName());
            msg.setStatus(InviteMessage.InviteMessageStatus.GROUPINVITATION_ACCEPTED);
            notifyNewInviteMessage(msg);
            broadcastManager.sendBroadcast(new Intent(EaseConstantSub.ACTION_GROUP_CHANAGED));
        }

        @Override
        public void onInvitationDeclined(String groupId, String invitee, String reason) {

            new InviteMessgeDao(mContext).deleteMessage(groupId);

            //user declined your invitation
            EMGroup group = null;
            for (EMGroup _group : EMClient.getInstance().groupManager().getAllGroups()) {
                if (_group.getGroupId().equals(groupId)) {
                    group = _group;
                    break;
                }
            }
            if (group == null)
                return;

            InviteMessage msg = new InviteMessage();
            msg.setFrom(groupId);
            msg.setTime(System.currentTimeMillis());
            msg.setGroupId(groupId);
            msg.setGroupName(group.getGroupName());
            msg.setReason(reason);
            msg.setGroupInviter(invitee);
            showToast(invitee + "Declined to join the group：" + group.getGroupName());
            msg.setStatus(InviteMessage.InviteMessageStatus.GROUPINVITATION_DECLINED);
            notifyNewInviteMessage(msg);
            broadcastManager.sendBroadcast(new Intent(EaseConstantSub.ACTION_GROUP_CHANAGED));
        }

        @Override
        public void onUserRemoved(String groupId, String groupName) {
            //user is removed from group
            broadcastManager.sendBroadcast(new Intent(EaseConstantSub.ACTION_GROUP_CHANAGED));
            showToast("current user removed, groupId:" + groupId);
        }

        @Override
        public void onGroupDestroyed(String groupId, String groupName) {
            // group is dismissed,
            broadcastManager.sendBroadcast(new Intent(EaseConstantSub.ACTION_GROUP_CHANAGED));
            showToast("group destroyed, groupId:" + groupId);
        }

        @Override
        public void onRequestToJoinReceived(String groupId, String groupName, String applyer, String reason) {

            // user apply to join group
            InviteMessage msg = new InviteMessage();
            msg.setFrom(applyer);
            msg.setTime(System.currentTimeMillis());
            msg.setGroupId(groupId);
            msg.setGroupName(groupName);
            msg.setReason(reason);
            showToast(applyer + " Apply to join group：" + groupId);
            msg.setStatus(InviteMessage.InviteMessageStatus.BEAPPLYED);
            notifyNewInviteMessage(msg);
            broadcastManager.sendBroadcast(new Intent(EaseConstantSub.ACTION_GROUP_CHANAGED));
        }

        @Override
        public void onRequestToJoinAccepted(String groupId, String groupName, String accepter) {

            String st4 = mContext.getString(R.string.Agreed_to_your_group_chat_application);
            // your application was accepted
            EMMessage msg = EMMessage.createReceiveMessage(EMMessage.Type.TXT);
            msg.setChatType(EMMessage.ChatType.GroupChat);
            msg.setFrom(accepter);
            msg.setTo(groupId);
            msg.setMsgId(UUID.randomUUID().toString());
            msg.addBody(new EMTextMessageBody(accepter + " " + st4));
            msg.setStatus(EMMessage.Status.SUCCESS);
            // save accept searchMessage
            EMClient.getInstance().chatManager().saveMessage(msg);
            // notify the accept searchMessage
            getNotifier().vibrateAndPlayTone(msg);

            showToast("request to join accepted, groupId:" + groupId);
            broadcastManager.sendBroadcast(new Intent(EaseConstantSub.ACTION_GROUP_CHANAGED));
        }

        @Override
        public void onRequestToJoinDeclined(String groupId, String groupName, String decliner, String reason) {
            // your application was declined, we do nothing here in demo
            showToast("request to join declined, groupId:" + groupId);
        }


        //没有验证，群聊拉人回调
        @Override
        public void onAutoAcceptInvitationFromGroup(String groupId, String inviter, String inviteMessage) {
            // got an invitation

            String st3 = inviter + " " + mContext.getString(R.string.Invite_you_to_join_a_group_chat);
            EaseUser easeUser = StrangersCachUtil.getUser(mContext, inviter);
            if (easeUser != null) {
                st3 = easeUser.getNick() + " " + mContext.getString(R.string.Invite_you_to_join_a_group_chat);
            }
            EMMessage msg = EMMessage.createReceiveMessage(EMMessage.Type.TXT);
            msg.setChatType(EMMessage.ChatType.GroupChat);
            msg.setFrom(inviter);
            msg.setTo(groupId);
            msg.setMsgId(UUID.randomUUID().toString());

            msg.setStatus(EMMessage.Status.SUCCESS);
            msg.setAttribute(EaseConstantSub.IS_ORDER_GROUP_CHAT, true);
            // save invitation as messages

            // notify invitation searchMessage
            msg.addBody(new EMTextMessageBody(st3));
            EMClient.getInstance().chatManager().saveMessage(msg);
//            getNotifier().onNewMsg(msg);
            showToast("auto accept invitation from groupId:" + groupId);
            broadcastManager.sendBroadcast(new Intent(EaseConstantSub.ACTION_GROUP_CHANAGED));
        }

        // ============================= group_reform new del api begin
        @Override
        public void onMuteListAdded(String groupId, final List<String> mutes, final long muteExpire) {
            StringBuilder sb = new StringBuilder();
            for (String member : mutes) {
                sb.append(member).append(",");
            }
            showToast("onMuterListAdded: " + sb.toString());
        }


        @Override
        public void onMuteListRemoved(String groupId, final List<String> mutes) {
            StringBuilder sb = new StringBuilder();
            for (String member : mutes) {
                sb.append(member).append(",");
            }
            showToast("onMuterListRemoved: " + sb.toString());
        }


        @Override
        public void onAdminAdded(String groupId, String administrator) {
            showToast("onAdminAdded: " + administrator);
        }

        @Override
        public void onAdminRemoved(String groupId, String administrator) {
            showToast("onAdminRemoved: " + administrator);
        }

        @Override
        public void onOwnerChanged(String groupId, String newOwner, String oldOwner) {
            showToast("onOwnerChanged new:" + newOwner + " old:" + oldOwner);
        }

        @Override
        public void onMemberJoined(String groupId, String member) {
            showToast("onMemberJoined: " + member);
        }

        @Override
        public void onMemberExited(String groupId, String member) {
            showToast("onMemberExited: " + member);
        }

        @Override
        public void onAnnouncementChanged(String groupId, String announcement) {
            showToast("onAnnouncementChanged, groupId" + groupId);
        }

        @Override
        public void onSharedFileAdded(String groupId, EMMucSharedFile sharedFile) {
            showToast("onSharedFileAdded, groupId" + groupId);
        }

        @Override
        public void onSharedFileDeleted(String groupId, String fileId) {
            showToast("onSharedFileDeleted, groupId" + groupId);
        }
        // ============================= group_reform new del api end
    }
}
