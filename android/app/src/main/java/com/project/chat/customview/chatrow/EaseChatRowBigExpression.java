package com.project.chat.customview.chatrow;

import android.content.Context;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.hyphenate.chat.EMMessage;
import com.project.R;
import com.project.chat.EaseConstant;
import com.project.chat.EaseUI;
import com.project.chat.domain.EaseEmojicon;

/**
 * big emoji icons
 *
 */
public class EaseChatRowBigExpression extends EaseChatRowText{

    private ImageView imageView;


    public EaseChatRowBigExpression(Context context, EMMessage message, int position, BaseAdapter adapter) {
        super(context, message, position, adapter);
    }
    
    @Override
    protected void onInflateView() {
        inflater.inflate(message.direct() == EMMessage.Direct.RECEIVE ?
                R.layout.ease_row_received_bigexpression : R.layout.ease_row_sent_bigexpression, this);
    }

    @Override
    protected void onFindViewById() {
        percentageView = (TextView) findViewById(R.id.percentage);
        imageView = (ImageView) findViewById(R.id.image);
    }


    @Override
    public void onSetUpView() {
        String emojiconId = message.getStringAttribute(EaseConstant.MESSAGE_ATTR_EXPRESSION_ID, null);
        EaseEmojicon emojicon = null;
        if(EaseUI.getInstance().getEmojiconInfoProvider() != null){
            emojicon =  EaseUI.getInstance().getEmojiconInfoProvider().getEmojiconInfo(emojiconId);
        }
        if(emojicon != null){
            if(emojicon.getBigIcon() != 0){
                Glide.with(activity).load(emojicon.getBigIcon()).into(imageView);
            }else if(emojicon.getBigIconPath() != null){
                Glide.with(activity).load(emojicon.getBigIconPath()).into(imageView);
            }else{
                imageView.setImageResource(R.drawable.ease_default_expression);
            }
        }
        
        handleTextMessage();
    }
}
