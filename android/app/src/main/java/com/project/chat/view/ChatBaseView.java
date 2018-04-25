package com.project.chat.view;

import android.app.Activity;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.v4.widget.SwipeRefreshLayout;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.FrameLayout;
import android.widget.ListView;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.hyphenate.EMMessageListener;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMConversation;
import com.hyphenate.chat.EMGroup;
import com.hyphenate.chat.EMImageMessageBody;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMTextMessageBody;
import com.hyphenate.exceptions.HyphenateException;
import com.hyphenate.util.PathUtil;
import com.project.R;
import com.project.bean.BusBean;
import com.project.bean.ChatShareBean;
import com.project.chat.EaseConstant;
import com.project.chat.EaseConstantSub;
import com.project.chat.EaseUI;
import com.project.chat.customview.EaseChatExtendMenu;
import com.project.chat.customview.EaseChatInputMenu;
import com.project.chat.customview.EaseChatMessageList;
import com.project.chat.customview.EaseEmojiconMenu;
import com.project.chat.customview.EaseVoiceRecorderView;
import com.project.chat.customview.chatrow.EaseCustomChatRowProvider;
import com.project.chat.domain.EaseEmojicon;
import com.project.chat.domain.EmojiconExampleGroupData;
import com.project.chat.listener.EaseGroupListener;
import com.project.chat.util.EaseCommonUtils;
import com.project.chat.util.Messenger;
import com.project.config.Const;
import com.project.util.Json_U;
import com.project.util.SPUtil;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by sshss on 2017/12/23.
 */

public class ChatBaseView extends FrameLayout implements EMMessageListener, LifecycleEventListener {
    protected static final String TAG = "EaseChatFragment";
    protected EaseChatFragmentHelper chatFragmentHelper;
    protected static final int REQUEST_CODE_MAP = 1;
    protected static final int REQUEST_CODE_CAMERA = 2;
    protected static final int REQUEST_CODE_LOCAL = 3;
    public ThemedReactContext mContext;

    /**
     * params to fragment
     */

//    protected Bundle fragmentArgs;
    public int chatType;
    protected String toChatUsername;
    protected EaseChatMessageList messageList;
    public EaseChatInputMenu inputMenu;

    protected EMConversation conversation;

    protected InputMethodManager inputManager;
    protected ClipboardManager clipboard;

    protected Handler handler = new Handler();
    protected File cameraFile;
    protected EaseVoiceRecorderView voiceRecorderView;
    protected SwipeRefreshLayout swipeRefreshLayout;
    protected ListView listView;

    protected boolean isloading;
    protected boolean haveMoreData = true;
    protected int pagesize = 20;
    protected GroupListener groupListener;
    protected EMMessage contextMenuMessage;

    static final int ITEM_TAKE_PICTURE = 1;
    static final int ITEM_PICTURE = 2;
    static final int ITEM_COLLECT = 3;
    static final int ITEM_MINGPIAN = 4;
    static final int ITEM_LOCATION = 5;

    protected int[] itemStrings = {R.string.attach_picture, R.string.attach_take_pic, R.string.collect, R.string.attach_location};
    protected int[] itemdrawables = {R.drawable.ease_chat_image_selector, R.drawable.ease_chat_takepic_selector,
            R.drawable.ic_collect, R.drawable.ease_chat_location_selector};

    protected int[] itemIds = {ITEM_PICTURE, ITEM_TAKE_PICTURE, ITEM_COLLECT, ITEM_LOCATION};
    private boolean isMessageListInited;
    protected MyItemClickListener extendMenuItemClickListener;
    protected boolean isRoaming = false;
    private ExecutorService fetchQueue;
    private View mMainView;

    public ChatBaseView(@NonNull ThemedReactContext context) {
        super(context);
        mContext = context;
    }
    @Override
    public void requestLayout() {
        super.requestLayout();
        post(new Runnable() {
            @Override
            public void run() {
                measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                        MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
                layout(getLeft(), getTop(), getRight(), getBottom());
            }
        });
    }
    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        EventBus.getDefault().unregister(this);
        EMClient.getInstance().chatManager().removeMessageListener(this);
        if (groupListener != null) {
            EMClient.getInstance().groupManager().removeGroupChangeListener(groupListener);
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        EventBus.getDefault().register(this);
        mMainView = View.inflate(mContext, R.layout.ease_fragment_chat, null);
        mContext.addLifecycleEventListener(this);
        addView(mMainView);
        EMClient.getInstance().chatManager().addMessageListener(this);
    }

    public void initViews(int chatType, String hxId) {
        this.chatType = chatType;
        toChatUsername = hxId;
        voiceRecorderView = (EaseVoiceRecorderView) mMainView.findViewById(R.id.voice_recorder);
        messageList = (EaseChatMessageList) mMainView.findViewById(R.id.message_list);
        if (chatType != EaseConstant.CHATTYPE_SINGLE)
            messageList.setShowUserNick(true);
//        messageList.setAvatarShape(1);
        listView = messageList.getListView();

        extendMenuItemClickListener = new MyItemClickListener();
        inputMenu = (EaseChatInputMenu) mMainView.findViewById(R.id.input_menu);
        initInputMenu();
        swipeRefreshLayout = messageList.getSwipeRefreshLayout();
        swipeRefreshLayout.setColorSchemeResources(R.color.colorPrimary);
        inputManager = (InputMethodManager) mContext.getCurrentActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        clipboard = (ClipboardManager) mContext.getCurrentActivity().getSystemService(Context.CLIPBOARD_SERVICE);
        mContext.getCurrentActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);

        if (isRoaming) {
            fetchQueue = Executors.newSingleThreadExecutor();
        }
    }

    public void setInputMenu(EaseChatInputMenu inputMenu){
        this.inputMenu = inputMenu;

    }

    private void initInputMenu() {
        registerExtendMenuItem();
        // init input menu
        inputMenu.init(null);
        inputMenu.setChatInputMenuListener(new EaseChatInputMenu.ChatInputMenuListener() {

            @Override
            public void onSendMessage(String content) {
                sendTextMessage(content);
            }

            @Override
            public boolean onPressToSpeakBtnTouch(View v, MotionEvent event) {
                return voiceRecorderView.onPressToSpeakBtnTouch(v, event, new EaseVoiceRecorderView.EaseVoiceRecorderCallback() {

                    @Override
                    public void onVoiceRecordComplete(String voiceFilePath, int voiceTimeLength) {
                        sendVoiceMessage(voiceFilePath, voiceTimeLength);
                    }
                });
            }

            @Override
            public void onBigExpressionClicked(EaseEmojicon emojicon) {
                sendBigExpressionMessage(emojicon.getName(), emojicon.getIdentityCode());
            }
        });
        ((EaseEmojiconMenu) inputMenu.getEmojiconMenu()).addEmojiconGroup(EmojiconExampleGroupData.getData());
    }

    protected void setUpView() {
        if (chatType == EaseConstant.CHATTYPE_GROUP) {
            //group chat
            EMGroup group = EMClient.getInstance().groupManager().getGroup(toChatUsername);
            if (group != null) {
                // listen the event that user moved out group or group is dismissed
                groupListener = new GroupListener();
                EMClient.getInstance().groupManager().addGroupChangeListener(groupListener);
            }
        }
        setRefreshLayoutListener();

        if (chatType != EaseConstant.CHATTYPE_CHATROOM) {
            onConversationInit();
            onMessageListInit();
        }
        // show forward searchMessage if the searchMessage is not null
//        String forward_msg_id = fragmentArgs.getString("forward_msg_id");
//        if (forward_msg_id != null) {
//            forwardMessage(forward_msg_id);
//        }
    }

    protected void onConversationInit() {
        conversation = EMClient.getInstance().chatManager().getConversation(toChatUsername, EaseCommonUtils.getConversationType(chatType), true);
        if (conversation != null)
            conversation.markAllMessagesAsRead();
        // the number of messages loaded into conversation is getChatOptions().getNumberOfMessagesLoaded
        // you can change this number

        if (!isRoaming) {
            final List<EMMessage> msgs = conversation.getAllMessages();
            int msgCount = msgs != null ? msgs.size() : 0;
            if (msgCount < conversation.getAllMsgCount() && msgCount < pagesize) {
                String msgId = null;
                if (msgs != null && msgs.size() > 0) {
                    msgId = msgs.get(0).getMsgId();
                }
                conversation.loadMoreMsgFromDB(msgId, pagesize - msgCount);
            }
        } else {
            fetchQueue.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        EMClient.getInstance().chatManager().fetchHistoryMessages(
                                toChatUsername, EaseCommonUtils.getConversationType(chatType), pagesize, "");
                        final List<EMMessage> msgs = conversation.getAllMessages();
                        int msgCount = msgs != null ? msgs.size() : 0;
                        if (msgCount < conversation.getAllMsgCount() && msgCount < pagesize) {
                            String msgId = null;
                            if (msgs != null && msgs.size() > 0) {
                                msgId = msgs.get(0).getMsgId();
                            }
                            conversation.loadMoreMsgFromDB(msgId, pagesize - msgCount);
                        }
                        messageList.refreshSelectLast();
                    } catch (HyphenateException e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }


    @Subscribe
    public void busEvent(BusBean bus) {
        if (bus.action == Const.ACTION_CLEAR_CHAT) {
            onMessageListInit();
        }
    }

    protected void onMessageListInit() {
        messageList.init(toChatUsername, chatType, chatFragmentHelper != null ?
                chatFragmentHelper.onSetCustomChatRowProvider() : null);
        setListItemClickListener();

        messageList.getListView().setOnTouchListener(new OnTouchListener() {

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                hideKeyboard();
                inputMenu.hideExtendMenuContainer();
                return false;
            }
        });

        isMessageListInited = true;
    }

    protected void hideKeyboard() {
        if (mContext.getCurrentActivity().getWindow().getAttributes().softInputMode != WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN) {
            if (mContext.getCurrentActivity().getCurrentFocus() != null)
                inputManager.hideSoftInputFromWindow(mContext.getCurrentActivity().getCurrentFocus().getWindowToken(),
                        InputMethodManager.HIDE_NOT_ALWAYS);
        }
    }

    protected void setListItemClickListener() {
        messageList.setItemClickListener(new EaseChatMessageList.MessageListItemClickListener() {

            @Override
            public void onUserAvatarClick(String username) {
                if (chatFragmentHelper != null) {
                    chatFragmentHelper.onAvatarClick(username);
                }
            }

            @Override
            public void onUserAvatarLongClick(String username) {
                if (chatFragmentHelper != null) {
                    chatFragmentHelper.onAvatarLongClick(username);
                }
            }

            @Override
            public void onResendClick(final EMMessage message) {
                resendMessage(message);
            }

            @Override
            public void onBubbleLongClick(EMMessage message) {
                contextMenuMessage = message;
                if (chatFragmentHelper != null) {
                    chatFragmentHelper.onMessageBubbleLongClick(message);
                }
            }

            @Override
            public boolean onBubbleClick(EMMessage message) {
                if (chatFragmentHelper == null) {
                    return false;
                }
                return chatFragmentHelper.onMessageBubbleClick(message);
            }

        });
    }

    public void resendMessage(EMMessage message) {
        message.setStatus(EMMessage.Status.CREATE);
        EMClient.getInstance().chatManager().sendMessage(message);
        messageList.refresh();
    }

    protected void setRefreshLayoutListener() {
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {

            @Override
            public void onRefresh() {
                new Handler().postDelayed(new Runnable() {

                    @Override
                    public void run() {
                        if (!isRoaming) {
                            loadMoreLocalMessage();
                        } else {
                            loadMoreRoamingMessages();
                        }
                    }
                }, 600);
            }
        });
    }

    private void loadMoreLocalMessage() {
        if (listView.getFirstVisiblePosition() == 0 && !isloading && haveMoreData) {
            List<EMMessage> messages;
            try {
                messages = conversation.loadMoreMsgFromDB(conversation.getAllMessages().size() == 0 ? "" : conversation.getAllMessages().get(0).getMsgId(),
                        pagesize);
            } catch (Exception e1) {
                swipeRefreshLayout.setRefreshing(false);
                return;
            }
            if (messages.size() > 0) {
                messageList.refreshSeekTo(messages.size() - 1);
                if (messages.size() != pagesize) {
                    haveMoreData = false;
                }
            } else {
                haveMoreData = false;
            }

            isloading = false;
        } else {
            Toast.makeText(mContext, getResources().getString(R.string.no_more_messages),
                    Toast.LENGTH_SHORT).show();
        }
        swipeRefreshLayout.setRefreshing(false);
    }

    private void loadMoreRoamingMessages() {
        if (!haveMoreData) {
            Toast.makeText(mContext, getResources().getString(R.string.no_more_messages),
                    Toast.LENGTH_SHORT).show();
            swipeRefreshLayout.setRefreshing(false);
            return;
        }
        if (fetchQueue != null) {
            fetchQueue.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        List<EMMessage> messages = conversation.getAllMessages();
                        EMClient.getInstance().chatManager().fetchHistoryMessages(
                                toChatUsername, EaseCommonUtils.getConversationType(chatType), pagesize,
                                (messages != null && messages.size() > 0) ? messages.get(0).getMsgId() : "");
                    } catch (HyphenateException e) {
                        e.printStackTrace();
                    } finally {
                        Activity activity = mContext.getCurrentActivity();
                        if (activity != null) {
                            activity.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    loadMoreLocalMessage();
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    protected void forwardMessage(String forward_msg_id) {
        final EMMessage forward_msg = EMClient.getInstance().chatManager().getMessage(forward_msg_id);
        EMMessage.Type type = forward_msg.getType();
        switch (type) {
            case TXT:
                if (forward_msg.getBooleanAttribute(EaseConstant.MESSAGE_ATTR_IS_BIG_EXPRESSION, false)) {
                    sendBigExpressionMessage(((EMTextMessageBody) forward_msg.getBody()).getMessage(),
                            forward_msg.getStringAttribute(EaseConstant.MESSAGE_ATTR_EXPRESSION_ID, null));
                } else {
                    // get the message and send it
                    String content = ((EMTextMessageBody) forward_msg.getBody()).getMessage();
                    sendTextMessage(content);
                }
                break;
            case IMAGE:
                // send image
                String filePath = ((EMImageMessageBody) forward_msg.getBody()).getLocalUrl();
                if (filePath != null) {
                    File file = new File(filePath);
                    if (!file.exists()) {
                        // send thumb nail if original image does not exist
                        filePath = ((EMImageMessageBody) forward_msg.getBody()).thumbnailLocalPath();
                    }
                    sendImageMessage(filePath);
                }
                break;
            default:
                break;
        }

    }

    protected void sendBigExpressionMessage(String name, String identityCode) {
        EMMessage message = EaseCommonUtils.createExpressionMessage(toChatUsername, name, identityCode);
        sendMessage(message);
    }

    protected void sendVoiceMessage(String filePath, int length) {
        EMMessage message = EMMessage.createVoiceSendMessage(filePath, length, toChatUsername);
        sendMessage(message);
    }

    protected void sendTextMessage(String content) {
        EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername);
        sendMessage(message);
    }

    public void registerExtendMenuItem() {
        for (int i = 0; i < itemStrings.length; i++) {
            inputMenu.registerExtendMenuItem(itemStrings[i], itemdrawables[i], itemIds[i], extendMenuItemClickListener);
        }
    }

    public void setChatFragmentHelper(EaseChatFragmentHelper chatFragmentHelper) {
        this.chatFragmentHelper = chatFragmentHelper;
    }

    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (resultCode == Activity.RESULT_OK) {
            if (requestCode == REQUEST_CODE_CAMERA) { // capture new image
                if (cameraFile != null && cameraFile.exists())
                    sendImageMessage(cameraFile.getAbsolutePath());
            } else if (requestCode == REQUEST_CODE_LOCAL) { // send local image
                if (data != null) {
                    Uri selectedImage = data.getData();
                    if (selectedImage != null) {
                        sendPicByUri(selectedImage);
                    }
                }
            } else if (requestCode == REQUEST_CODE_MAP) { // location
//                double latitude = data.getDoubleExtra("latitude", 0);
//                double longitude = data.getDoubleExtra("longitude", 0);
//                String locationAddress = data.getStringExtra("address");
//                if (locationAddress != null && !locationAddress.equals("")) {
//                    sendLocationMessage(latitude, longitude, locationAddress);
//                } else {
//                    Toast.makeText(getActivity(), R.string.unable_to_get_loaction, Toast.LENGTH_SHORT).show();
//                }

            }
        }
    }

    protected void sendPicByUri(Uri selectedImage) {
        String[] filePathColumn = {MediaStore.Images.Media.DATA};
        Cursor cursor = mContext.getCurrentActivity().getContentResolver().query(selectedImage, filePathColumn, null, null, null);
        if (cursor != null) {
            cursor.moveToFirst();
            int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
            String picturePath = cursor.getString(columnIndex);
            cursor.close();
            cursor = null;

            if (picturePath == null || picturePath.equals("null")) {
                Toast toast = Toast.makeText(mContext.getCurrentActivity(), R.string.cant_find_pictures, Toast.LENGTH_SHORT);
                toast.setGravity(Gravity.CENTER, 0, 0);
                toast.show();
                return;
            }
            sendImageMessage(picturePath);
        } else {
            File file = new File(selectedImage.getPath());
            if (!file.exists()) {
                Toast toast = Toast.makeText(mContext.getCurrentActivity(), R.string.cant_find_pictures, Toast.LENGTH_SHORT);
                toast.setGravity(Gravity.CENTER, 0, 0);
                toast.show();
                return;

            }
            sendImageMessage(file.getAbsolutePath());
        }

    }

    public void sendShareMessage(String json) {
        String content = null;
        ChatShareBean shareBean = Json_U.fromJson(json, ChatShareBean.class);
        switch (shareBean.type) {
            case 0:
                content = "[名片]";
                break;
            case 1:
                content = "[动态]";
                break;
            case 2:
                content = "[店铺]";
                break;
            case 3:
                content = "[商品]";
                break;
        }
        EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername);
        message.setAttribute(EaseConstantSub.MESSAGE_TYPE_SHARE, true);
        message.setAttribute(Const.SHARE_INFO, json);
        sendMessage(message);
    }

    protected void sendImageMessage(String imagePath) {
        EMMessage message = EMMessage.createImageSendMessage(imagePath, false, toChatUsername);
        sendMessage(message);
    }

    protected void sendMessage(EMMessage message) {
        if (message == null) {
            return;
        }
        if (chatFragmentHelper != null) {
            //set extension
            chatFragmentHelper.onSetMessageAttributes(message);
        }
        if (chatType == EaseConstant.CHATTYPE_GROUP) {
            message.setChatType(EMMessage.ChatType.GroupChat);
        } else if (chatType == EaseConstant.CHATTYPE_CHATROOM) {
            message.setChatType(EMMessage.ChatType.ChatRoom);
        }
        message.setAttribute(EaseConstant.USER_NICK, SPUtil.getString(Const.USER_NICK, ""));
        message.setAttribute(EaseConstant.USER_HEAD, SPUtil.getString(Const.USER_HEADER, ""));
        //send searchMessage
        EMClient.getInstance().chatManager().sendMessage(message);
        //refresh ui
        if (isMessageListInited) {
            messageList.refreshSelectLast();
        }
    }


    @Override
    public void onHostResume() {
        if (isMessageListInited)
            messageList.refresh();
        EMClient.getInstance().chatManager().addMessageListener(this);
    }

    @Override
    public void onHostPause() {
        EMClient.getInstance().chatManager().removeMessageListener(this);
    }

    @Override
    public void onHostDestroy() {
        if (groupListener != null) {
            EMClient.getInstance().groupManager().removeGroupChangeListener(groupListener);
        }
    }

    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        Log.e(TAG, "onMessageReceived");
        for (EMMessage message : messages) {
            String username = null;
            // group searchMessage
            if (message.getChatType() == EMMessage.ChatType.GroupChat || message.getChatType() == EMMessage.ChatType.ChatRoom) {
                username = message.getTo();
            } else {
                // single chat searchMessage
                username = message.getFrom();
            }
            try {
                String status = message.getStringAttribute("status");
                Log.e(TAG, "status: " + status);

            } catch (HyphenateException e) {
                e.printStackTrace();
                Log.e(TAG, "NO Status");
            }
            // if the searchMessage is for current conversation

            if (username.equals(toChatUsername) || message.getTo().equals(toChatUsername) || message.conversationId().equals(toChatUsername)) {
                messageList.refreshSelectLast();
                EaseUI.getInstance().getNotifier().vibrateAndPlayTone(message);
                conversation.markMessageAsRead(message.getMsgId());
            } else {
                EaseUI.getInstance().getNotifier().onNewMsg(message);
            }
        }
    }

    @Override
    public void onCmdMessageReceived(List<EMMessage> list) {

    }

    @Override
    public void onMessageRead(List<EMMessage> list) {
        if (isMessageListInited) {
            messageList.refresh();
        }
    }

    @Override
    public void onMessageDelivered(List<EMMessage> list) {
        if (isMessageListInited) {
            messageList.refresh();
        }
    }

    @Override
    public void onMessageRecalled(List<EMMessage> list) {
        if (isMessageListInited) {
            messageList.refresh();
        }
    }

    @Override
    public void onMessageChanged(EMMessage emMessage, Object o) {
        if (isMessageListInited) {
            messageList.refresh();
        }
    }

    public void setQuickReplyData(String dataJson) {
        inputMenu.setQuickReplyData(dataJson, new EaseChatInputMenu.OnQuickReplyListener() {
            @Override
            public void onClick(String message) {
                sendTextMessage(message);
            }
        });
    }

    class GroupListener extends EaseGroupListener {

        @Override
        public void onUserRemoved(final String groupId, String groupName) {
            mContext.getCurrentActivity().runOnUiThread(new Runnable() {

                public void run() {
                    if (toChatUsername.equals(groupId)) {
                        Toast.makeText(mContext.getCurrentActivity(), R.string.you_are_group, Toast.LENGTH_LONG).show();
                        Messenger.getInstance(Messenger.REMOVE_FROM_GROUP).send();
                    }
                }
            });
        }

        @Override
        public void onGroupDestroyed(final String groupId, String groupName) {
            // prompt group is dismissed and finish this activity
            mContext.getCurrentActivity().runOnUiThread(new Runnable() {
                public void run() {
                    if (toChatUsername.equals(groupId)) {
                        Toast.makeText(mContext.getCurrentActivity(), "群聊解散", Toast.LENGTH_LONG).show();
                        Messenger.getInstance(Messenger.GROUP_DESTROY).send();
                    }
                }
            });
        }
    }

    class MyItemClickListener implements EaseChatExtendMenu.EaseChatExtendMenuItemClickListener {

        @Override
        public void onClick(int itemId, View view) {
            if (chatFragmentHelper != null) {
                if (chatFragmentHelper.onExtendMenuItemClick(itemId, view)) {
                    return;
                }
            }
            switch (itemId) {
                case ITEM_TAKE_PICTURE:
                    selectPicFromCamera();
                    break;
                case ITEM_PICTURE:
                    selectPicFromLocal();
                    break;
                case ITEM_COLLECT:
                    WritableMap event = Arguments.createMap();
                    event.putString("action", "to_select_collection");
                    mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("event", event);
                    break;
                case ITEM_MINGPIAN:

                    break;

                default:
                    break;
            }
        }
    }

    protected void selectPicFromCamera() {
        if (!EaseCommonUtils.isSdcardExist()) {
            Toast.makeText(mContext, R.string.sd_card_does_not_exist, Toast.LENGTH_SHORT).show();
            return;
        }

        cameraFile = new File(PathUtil.getInstance().getImagePath(), EMClient.getInstance().getCurrentUser()
                + System.currentTimeMillis() + ".jpg");
        //noinspection ResultOfMethodCallIgnored
        cameraFile.getParentFile().mkdirs();
        mContext.startActivityForResult(
                new Intent(MediaStore.ACTION_IMAGE_CAPTURE).putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(cameraFile)),
                REQUEST_CODE_CAMERA, null);
    }

    protected void selectPicFromLocal() {
        Intent intent;
        if (Build.VERSION.SDK_INT < 19) {
            intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("image/*");

        } else {
            intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        }
        mContext.startActivityForResult(intent, REQUEST_CODE_LOCAL, null);
    }

    public interface EaseChatFragmentHelper {
        /**
         * set searchMessage attribute
         */
        void onSetMessageAttributes(EMMessage message);

        /**
         * enter to chat detail
         */
        void onEnterToChatDetails();

        /**
         * on avatar clicked
         *
         * @param username
         */
        void onAvatarClick(String username);

        /**
         * on avatar long pressed
         *
         * @param username
         */
        void onAvatarLongClick(String username);

        /**
         * on searchMessage bubble clicked
         */
        boolean onMessageBubbleClick(EMMessage message);

        /**
         * on searchMessage bubble long pressed
         */
        void onMessageBubbleLongClick(EMMessage message);

        /**
         * on extend menu item clicked, return true if you want to override
         *
         * @param view
         * @param itemId
         * @return
         */
        boolean onExtendMenuItemClick(int itemId, View view);

        /**
         * on set custom chat row provider
         *
         * @return
         */
        EaseCustomChatRowProvider onSetCustomChatRowProvider();
    }
}
