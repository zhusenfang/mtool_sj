package com.project.chat.customview;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Handler;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

import com.facebook.react.uimanager.ThemedReactContext;
import com.project.R;
import com.project.bean.QuickReplyBean;
import com.project.chat.domain.EaseEmojicon;
import com.project.chat.domain.EaseEmojiconGroupEntity;
import com.project.chat.model.EaseDefaultEmojiconDatas;
import com.project.chat.util.EaseSmileUtils;
import com.project.chat.util.Messenger;
import com.project.util.Json_U;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * input menu
 * <p>
 * including below component:
 * EaseChatPrimaryMenu: main menu bar, text input, send button
 * EaseChatExtendMenu: grid menu with image, file, location, etc
 * EaseEmojiconMenu: emoji icons
 */
public class EaseChatInputMenu extends LinearLayout {
    FrameLayout primaryMenuContainer, emojiconMenuContainer;
    protected EaseChatPrimaryMenuBase chatPrimaryMenu;
    protected EaseEmojiconMenuBase emojiconMenu;
    protected EaseChatExtendMenu chatExtendMenu;
    protected FrameLayout chatExtendMenuContainer;

    private Handler handler = new Handler();
    private ChatInputMenuListener listener;
    private Context context;
    private boolean inited;
    private ListView mListViewQuickRp;
    private View mMainView;

    public EaseChatInputMenu(ThemedReactContext context) {
        super(context);
        this.context = context;
    }

    public EaseChatInputMenu(Context context) {
        this(context,null);
    }

    public EaseChatInputMenu(Context context, @Nullable AttributeSet attrs) {
        this(context, attrs,0);
    }

    public EaseChatInputMenu(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        this.context = context;
        init(context, null);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
//        Messenger.getInstance(Messenger.INPUT_MENU_LOADED).send();
    }

    private void init(Context context, AttributeSet attrs) {
        this.context = context;
        mMainView = View.inflate(context, R.layout.ease_widget_chat_input_menu, null);
        addView(mMainView);
        primaryMenuContainer = (FrameLayout) mMainView.findViewById(R.id.primary_menu_container);
        emojiconMenuContainer = (FrameLayout) mMainView.findViewById(R.id.emojicon_menu_container);
        chatExtendMenuContainer = (FrameLayout) mMainView.findViewById(R.id.extend_menu_container);
        // extend menu
        chatExtendMenu = (EaseChatExtendMenu) mMainView.findViewById(R.id.extend_menu);
        mListViewQuickRp = (ListView) mMainView.findViewById(R.id.listview_quick_reply);

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


    /**
     * init view
     * <p>
     * This method should be called after registerExtendMenuItem(), setCustomEmojiconMenu() and setCustomPrimaryMenu().
     *
     * @param emojiconGroupList --will use default if null
     */
    @SuppressLint("InflateParams")
    public void init(List<EaseEmojiconGroupEntity> emojiconGroupList) {
        if (inited) {
            return;
        }
        // primary menu, use default if no customized one
        if (chatPrimaryMenu == null) {
            chatPrimaryMenu = (EaseChatPrimaryMenu) View.inflate(context, R.layout.ease_layout_chat_primary_menu, null);
        }
        primaryMenuContainer.addView(chatPrimaryMenu);

        // emojicon menu, use default if no customized one
        if (emojiconMenu == null) {
            emojiconMenu = (EaseEmojiconMenu) View.inflate(context, R.layout.ease_layout_emojicon_menu, null);
            if (emojiconGroupList == null) {
                emojiconGroupList = new ArrayList<EaseEmojiconGroupEntity>();
                emojiconGroupList.add(new EaseEmojiconGroupEntity(R.drawable.ee_1, Arrays.asList(EaseDefaultEmojiconDatas.getData())));
            }
            ((EaseEmojiconMenu) emojiconMenu).init(emojiconGroupList);
        }
        emojiconMenuContainer.addView(emojiconMenu);

        processChatMenu();
        chatExtendMenu.init();

        inited = true;
    }

    public void init() {
        init(null);
    }

    /**
     * set custom emojicon menu
     *
     * @param customEmojiconMenu
     */
    public void setCustomEmojiconMenu(EaseEmojiconMenuBase customEmojiconMenu) {
        this.emojiconMenu = customEmojiconMenu;
    }

    /**
     * set custom primary menu
     *
     * @param customPrimaryMenu
     */
    public void setCustomPrimaryMenu(EaseChatPrimaryMenuBase customPrimaryMenu) {
        this.chatPrimaryMenu = customPrimaryMenu;
    }

    public EaseChatPrimaryMenuBase getPrimaryMenu() {
        return chatPrimaryMenu;
    }

    public EaseChatExtendMenu getExtendMenu() {
        return chatExtendMenu;
    }

    public EaseEmojiconMenuBase getEmojiconMenu() {
        return emojiconMenu;
    }


    /**
     * register menu item
     *
     * @param name        item name
     * @param drawableRes background of item
     * @param itemId      id
     * @param listener    on click event of item
     */
    public void registerExtendMenuItem(String name, int drawableRes, int itemId,
                                       EaseChatExtendMenu.EaseChatExtendMenuItemClickListener listener) {
        chatExtendMenu.registerMenuItem(name, drawableRes, itemId, listener);
    }

    /**
     * register menu item
     * <p>
     * resource id of item name
     *
     * @param drawableRes background of item
     * @param itemId      id
     * @param listener    on click event of item
     */
    public void registerExtendMenuItem(int nameRes, int drawableRes, int itemId,
                                       EaseChatExtendMenu.EaseChatExtendMenuItemClickListener listener) {
        chatExtendMenu.registerMenuItem(nameRes, drawableRes, itemId, listener);
    }


    protected void processChatMenu() {
        // send message button
        chatPrimaryMenu.setChatPrimaryMenuListener(new EaseChatPrimaryMenuBase.EaseChatPrimaryMenuListener() {

            @Override
            public void onSendBtnClicked(String content) {
                if (listener != null)
                    listener.onSendMessage(content);
            }

            @Override
            public void onToggleVoiceBtnClicked() {
                hideExtendMenuContainer();
            }

            @Override
            public void onToggleExtendClicked() {
                toggleMore();
            }

            @Override
            public void onToggleEmojiconClicked() {
                toggleEmojicon();
            }

            @Override
            public void onEditTextClicked() {
                hideExtendMenuContainer();
            }


            @Override
            public boolean onPressToSpeakBtnTouch(View v, MotionEvent event) {
                if (listener != null) {
                    return listener.onPressToSpeakBtnTouch(v, event);
                }
                return false;
            }
        });

        // emojicon menu
        emojiconMenu.setEmojiconMenuListener(new EaseEmojiconMenuBase.EaseEmojiconMenuListener() {

            @Override
            public void onExpressionClicked(EaseEmojicon emojicon) {
                if (emojicon.getType() != EaseEmojicon.Type.BIG_EXPRESSION) {
                    if (emojicon.getEmojiText() != null) {
                        chatPrimaryMenu.onEmojiconInputEvent(EaseSmileUtils.getSmiledText(context, emojicon.getEmojiText()));
                    }
                } else {
                    if (listener != null) {
                        listener.onBigExpressionClicked(emojicon);
                    }
                }
            }

            @Override
            public void onDeleteImageClicked() {
                chatPrimaryMenu.onEmojiconDeleteEvent();
            }
        });

    }


    /**
     * insert text
     *
     * @param text
     */
    public void insertText(String text) {
        getPrimaryMenu().onTextInsert(text);
    }

    /**
     * show or hide extend menu
     */
    protected void toggleMore() {
        if (chatExtendMenuContainer.getVisibility() == View.GONE) {
            hideKeyboard();
            handler.postDelayed(new Runnable() {
                public void run() {
                    chatExtendMenuContainer.setVisibility(View.VISIBLE);
                    chatExtendMenu.setVisibility(View.VISIBLE);
                    emojiconMenu.setVisibility(View.GONE);
                }
            }, 50);
        } else {
            if (emojiconMenu.getVisibility() == View.VISIBLE) {
                emojiconMenu.setVisibility(View.GONE);
                chatExtendMenu.setVisibility(View.VISIBLE);
            } else {
                chatExtendMenuContainer.setVisibility(View.GONE);
            }
        }
    }

    /**
     * show or hide emojicon
     */
    protected void toggleEmojicon() {
        if (chatExtendMenuContainer.getVisibility() == View.GONE) {
            hideKeyboard();
            handler.postDelayed(new Runnable() {
                public void run() {
                    chatExtendMenuContainer.setVisibility(View.VISIBLE);
                    chatExtendMenu.setVisibility(View.GONE);
                    emojiconMenu.setVisibility(View.VISIBLE);
                }
            }, 50);
        } else {
            if (emojiconMenu.getVisibility() == View.VISIBLE) {
                chatExtendMenuContainer.setVisibility(View.GONE);
                emojiconMenu.setVisibility(View.GONE);
            } else {
                chatExtendMenu.setVisibility(View.GONE);
                emojiconMenu.setVisibility(View.VISIBLE);
            }

        }
    }

    /**
     * hide keyboard
     */
    private void hideKeyboard() {
        chatPrimaryMenu.hideKeyboard();
    }

    /**
     * hide extend menu
     */
    public void hideExtendMenuContainer() {
        chatExtendMenu.setVisibility(View.GONE);
        emojiconMenu.setVisibility(View.GONE);
        chatExtendMenuContainer.setVisibility(View.GONE);
        chatPrimaryMenu.onExtendMenuContainerHide();
    }

    /**
     * when back key pressed
     *
     * @return false--extend menu is on, will hide it first
     * true --extend menu is off
     */
    public boolean onBackPressed() {
        if (chatExtendMenuContainer.getVisibility() == View.VISIBLE) {
            hideExtendMenuContainer();
            return false;
        } else {
            return true;
        }

    }


    public void setChatInputMenuListener(ChatInputMenuListener listener) {
        this.listener = listener;
    }

    private QuickAdapter mQuickAdapter;

    public void showQuickReply() {
        mListViewQuickRp.setVisibility(VISIBLE);
        chatExtendMenu.setVisibility(INVISIBLE);
        emojiconMenu.setVisibility(INVISIBLE);
        if (mQuickAdapter == null)
            Messenger.getInstance(Messenger.QUICK_REPLY).send();
    }

    public void setQuickReplyData(String dataJson, final OnQuickReplyListener listener) {
        if (dataJson != null) {
            QuickReplyBean quickReplyBean = Json_U.fromJson(dataJson, QuickReplyBean.class);
            List<QuickReplyBean.Data> data = quickReplyBean.data;
            if (data != null) {
                mQuickAdapter = new QuickAdapter(data);
                mListViewQuickRp.setAdapter(mQuickAdapter);
                mListViewQuickRp.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                        QuickReplyBean.Data item = mQuickAdapter.getItem(position);
                        listener.onClick(item.message);
                        hideExtendMenuContainer();
                    }
                });
            }
        }
    }

    public interface OnQuickReplyListener {
        void onClick(String message);
    }

    public interface ChatInputMenuListener {
        /**
         * when send message button pressed
         *
         * @param content message message
         */
        void onSendMessage(String content);

        /**
         * when big icon pressed
         *
         * @param emojicon
         */
        void onBigExpressionClicked(EaseEmojicon emojicon);

        /**
         * when speak button is touched
         *
         * @param v
         * @param event
         * @return
         */
        boolean onPressToSpeakBtnTouch(View v, MotionEvent event);
    }

    private class QuickAdapter extends BaseAdapter {

        private final List<QuickReplyBean.Data> mData;

        public QuickAdapter(List<QuickReplyBean.Data> data) {
            mData = data;
        }

        @Override
        public int getCount() {
            return mData.size();
        }

        @Override
        public QuickReplyBean.Data getItem(int position) {
            return mData.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            if (convertView == null) {
                convertView = View.inflate(context, R.layout.item_quick_reply, null);
            }
            TextView content = (TextView) convertView.findViewById(R.id.tv_content);
            content.setText(mData.get(position).message);
            return convertView;
        }
    }

}
