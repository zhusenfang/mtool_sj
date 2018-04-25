package com.project.chat.customview.chatrow;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.hyphenate.EMCallBack;
import com.hyphenate.EMError;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMMessage.Direct;
import com.hyphenate.util.DateUtils;
import com.project.MyApplication;
import com.project.R;
import com.project.chat.EaseConstant;
import com.project.chat.adapter.EaseMessageAdapter;
import com.project.chat.customview.EaseChatMessageList;
import com.project.chat.model.EaseMessageListItemStyle;
import com.project.util.EaseUserUtils;

import java.util.Date;

public abstract class EaseChatRow extends LinearLayout {
    protected static final String TAG = EaseChatRow.class.getSimpleName();

    protected LayoutInflater inflater;
    protected Context context;
    protected BaseAdapter adapter;
    protected EMMessage message;
    protected int position;

    protected TextView timeStampView;
    protected ImageView userAvatarView;
    protected View bubbleLayout;
    protected TextView usernickView;

    protected TextView percentageView;
    protected ProgressBar progressBar;
    protected ImageView statusView;
    protected Activity activity;

    protected TextView ackedView;
    protected TextView deliveredView;

    protected EMCallBack messageSendCallback;
    protected EMCallBack messageReceiveCallback;

    protected EaseChatMessageList.MessageListItemClickListener itemClickListener;
    protected EaseMessageListItemStyle itemStyle;

    public EaseChatRow(Context context, EMMessage message, int position, BaseAdapter adapter) {
        super(context);
        this.context = context;
        this.activity = MyApplication.getInstance().reactiContext.getCurrentActivity();
        this.message = message;
        this.position = position;
        this.adapter = adapter;
        inflater = LayoutInflater.from(context);
        initView();
    }

    private void initView() {
        onInflateView();
        timeStampView = (TextView) findViewById(R.id.timestamp);
        userAvatarView = (ImageView) findViewById(R.id.iv_userhead);
        bubbleLayout = findViewById(R.id.bubble);
        usernickView = (TextView) findViewById(R.id.tv_userid);

        progressBar = (ProgressBar) findViewById(R.id.progress_bar);
        statusView = (ImageView) findViewById(R.id.msg_status);
        ackedView = (TextView) findViewById(R.id.tv_ack);
        deliveredView = (TextView) findViewById(R.id.tv_delivered);

        onFindViewById();
    }

    /**
     * set property according message and postion
     *
     * @param message
     * @param position
     */
    public void setUpView(EMMessage message, int position,
                          EaseChatMessageList.MessageListItemClickListener itemClickListener,
                          EaseMessageListItemStyle itemStyle) {
        this.message = message;
        this.position = position;
        this.itemClickListener = itemClickListener;
        this.itemStyle = itemStyle;

        setUpBaseView();
        onSetUpView();
        setClickListener();
    }

    private void setUpBaseView() {
        // set nickname, avatar and background of bubble
        TextView timestamp = (TextView) findViewById(R.id.timestamp);
        if (timestamp != null) {
            if (position == 0) {
                timestamp.setText(DateUtils.getTimestampString(new Date(message.getMsgTime())));
                timestamp.setVisibility(View.VISIBLE);
            } else {
                // show time stamp if interval with last message is > 30 seconds
                EMMessage prevMessage = (EMMessage) adapter.getItem(position - 1);
                if (prevMessage != null && DateUtils.isCloseEnough(message.getMsgTime(), prevMessage.getMsgTime())) {
                    timestamp.setVisibility(View.GONE);
                } else {
                    timestamp.setText(DateUtils.getTimestampString(new Date(message.getMsgTime())));
                    timestamp.setVisibility(View.VISIBLE);
                }
            }
        }
        if (userAvatarView != null) {
            //set nickname and avatar
            if (message.direct() == Direct.SEND) {
                SharedPreferences lkxcatch = getContext().getSharedPreferences("lkxcatch", Context.MODE_PRIVATE);
                String headerUrl = lkxcatch.getString("USER_HEADER", "");
                String nickName = lkxcatch.getString("USER_NICK", "");
                if (!TextUtils.isEmpty(headerUrl))
                    Glide.with(context).load(headerUrl).into(userAvatarView);
                else
                    EaseUserUtils.setUserAvatar(context, EMClient.getInstance().getCurrentUser(), userAvatarView);

                if (!TextUtils.isEmpty(nickName) && usernickView != null) {
                    usernickView.setText(nickName);
                }
            } else {

                String headerUrl = message.getStringAttribute(EaseConstant.USER_HEAD, "");
                String nickName = message.getStringAttribute(EaseConstant.USER_NICK, "");

//                if (!TextUtils.isEmpty(headerUrl))
//                    Glide.with(context).load(headerUrl).into(userAvatarView);
//                else
//                    userAvatarView.setImageResource(R.drawable.ic_new_firend);
//
//                if (!TextUtils.isEmpty(nickName) && usernickView != null) {
//                    usernickView.setText(nickName);
//                }

                EaseUserUtils.setUserAvatar(context, message.getFrom(), userAvatarView);
                EaseUserUtils.setUserNick(context, message.getFrom(), usernickView);
            }
        }
        if (deliveredView != null) {
            if (message.isDelivered()) {
                deliveredView.setVisibility(View.VISIBLE);
            } else {
                deliveredView.setVisibility(View.INVISIBLE);
            }
        }

        if (ackedView != null) {
            if (message.isAcked()) {
                if (deliveredView != null) {
                    deliveredView.setVisibility(View.INVISIBLE);
                }
                ackedView.setVisibility(View.VISIBLE);
            } else {
                ackedView.setVisibility(View.INVISIBLE);
            }
        }

        if (itemStyle != null) {
            if (userAvatarView != null) {
                if (itemStyle.isShowAvatar()) {
                    userAvatarView.setVisibility(View.VISIBLE);

                } else {
                    userAvatarView.setVisibility(View.GONE);
                }
            }
            if (usernickView != null) {
                if (itemStyle.isShowUserNick())
                    usernickView.setVisibility(View.VISIBLE);
                else
                    usernickView.setVisibility(View.GONE);
            }
            if (bubbleLayout != null) {
                if (message.direct() == Direct.SEND) {
                    if (itemStyle.getMyBubbleBg() != null) {
                        bubbleLayout.setBackgroundDrawable(((EaseMessageAdapter) adapter).getMyBubbleBg());
                    }
                } else if (message.direct() == Direct.RECEIVE) {
                    if (itemStyle.getOtherBubbleBg() != null) {
                        bubbleLayout.setBackgroundDrawable(((EaseMessageAdapter) adapter).getOtherBubbleBg());
                    }
                }
            }
        }

    }

    /**
     * set callback for sending message
     */
    protected void setMessageSendCallback() {
        if (messageSendCallback == null) {
            messageSendCallback = new EMCallBack() {

                @Override
                public void onSuccess() {
                    updateView();
                }

                @Override
                public void onProgress(final int progress, String status) {
                    activity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (percentageView != null)
                                percentageView.setText(progress + "%");

                        }
                    });
                }

                @Override
                public void onError(int code, String error) {
                    updateView(code, error);
                }
            };
        }
        message.setMessageStatusCallback(messageSendCallback);
    }

    /**
     * set callback for receiving message
     */
    protected void setMessageReceiveCallback() {
        if (messageReceiveCallback == null) {
            messageReceiveCallback = new EMCallBack() {

                @Override
                public void onSuccess() {
                    updateView();
                }

                @Override
                public void onProgress(final int progress, String status) {
                    activity.runOnUiThread(new Runnable() {
                        public void run() {
                            if (percentageView != null) {
                                percentageView.setText(progress + "%");
                            }
                        }
                    });
                }

                @Override
                public void onError(int code, String error) {
                    updateView();
                }
            };
        }
        message.setMessageStatusCallback(messageReceiveCallback);
    }


    private void setClickListener() {
        if (bubbleLayout != null) {
            bubbleLayout.setOnClickListener(new OnClickListener() {

                @Override
                public void onClick(View v) {
                    if (itemClickListener != null) {
                        if (!itemClickListener.onBubbleClick(message)) {
                            // if listener return false, we call default handling
                            onBubbleClick();
                        }
                    }
                }
            });

            bubbleLayout.setOnLongClickListener(new OnLongClickListener() {

                @Override
                public boolean onLongClick(View v) {
                    if (itemClickListener != null) {
                        itemClickListener.onBubbleLongClick(message);
                    }
                    return true;
                }
            });
        }

        if (statusView != null) {
            statusView.setOnClickListener(new OnClickListener() {

                @Override
                public void onClick(View v) {
                    if (itemClickListener != null) {
                        itemClickListener.onResendClick(message);
                    }
                }
            });
        }

        if (userAvatarView != null) {
            userAvatarView.setOnClickListener(new OnClickListener() {

                @Override
                public void onClick(View v) {
                    if (itemClickListener != null) {
                        if (message.direct() == Direct.SEND) {
                            itemClickListener.onUserAvatarClick(EMClient.getInstance().getCurrentUser());
                        } else {
                            itemClickListener.onUserAvatarClick(message.getFrom());
                        }
                    }
                }
            });
            userAvatarView.setOnLongClickListener(new OnLongClickListener() {
                @Override
                public boolean onLongClick(View v) {
                    if (itemClickListener != null) {
                        if (message.direct() == Direct.SEND) {
                            itemClickListener.onUserAvatarLongClick(EMClient.getInstance().getCurrentUser());
                        } else {
                            itemClickListener.onUserAvatarLongClick(message.getFrom());
                        }
                        return true;
                    }
                    return false;
                }
            });
        }
    }


    protected void updateView() {
        activity.runOnUiThread(new Runnable() {
            public void run() {
                if (message.status() == EMMessage.Status.FAIL) {
                    Toast.makeText(activity, activity.getString(R.string.send_fail) + activity.getString(R.string.connect_failuer_toast), Toast.LENGTH_SHORT).show();
                }

                onUpdateView();
            }
        });
    }

    protected void updateView(final int errorCode, final String desc) {
        activity.runOnUiThread(new Runnable() {
            public void run() {
                if (errorCode == EMError.MESSAGE_INCLUDE_ILLEGAL_CONTENT) {
                    Toast.makeText(activity, activity.getString(R.string.send_fail) + activity.getString(R.string.error_send_invalid_content), Toast.LENGTH_SHORT).show();
                } else if (errorCode == EMError.GROUP_NOT_JOINED) {
                    Toast.makeText(activity, activity.getString(R.string.send_fail) + activity.getString(R.string.error_send_not_in_the_group), Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(activity, activity.getString(R.string.send_fail) + activity.getString(R.string.connect_failuer_toast), Toast.LENGTH_SHORT).show();
                }
                onUpdateView();
            }
        });
    }

    protected abstract void onInflateView();

    /**
     * find view by id
     */
    protected abstract void onFindViewById();

    /**
     * refresh list view when message status change
     */
    protected abstract void onUpdateView();

    /**
     * setup view
     */
    protected abstract void onSetUpView();

    /**
     * on bubble clicked
     */
    protected abstract void onBubbleClick();

}
