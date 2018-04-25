package com.project.chat.adapter;

import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.hyphenate.chat.EMChatRoom;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMConversation;
import com.hyphenate.chat.EMGroup;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.util.DateUtils;
import com.project.R;
import com.project.chat.EaseConstant;
import com.project.chat.domain.ConversationExtBean;
import com.project.chat.domain.GroupChatExtBean;
import com.project.chat.util.EaseCommonUtils;
import com.project.chat.util.EaseSmileUtils;
import com.project.util.EaseUserUtils;
import com.project.util.Json_U;

import java.util.Date;
import java.util.List;

import static com.project.MyApplication.getContext;

/**
 * Created by sshss on 2017/12/21.
 */

public class ConversationAdapter extends BaseAdapter {
    private List<EMConversation> mData;

    public ConversationAdapter(List<EMConversation> conversationList) {
        mData = conversationList;
    }

    @Override
    public int getCount() {
        return mData.size();
    }

    @Override
    public EMConversation getItem(int position) {
        return mData.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.ease_row_chat_history, parent, false);
        }
        ViewHolder holder = (ViewHolder) convertView.getTag();
        if (holder == null) {
            holder = new ViewHolder();
            holder.name = (TextView) convertView.findViewById(R.id.name);
            holder.unreadLabel = (TextView) convertView.findViewById(R.id.unread_msg_number);
            holder.message = (TextView) convertView.findViewById(R.id.message);
            holder.time = (TextView) convertView.findViewById(R.id.time);
            holder.avatar = (ImageView) convertView.findViewById(R.id.avatar);
            holder.msgState = convertView.findViewById(R.id.msg_state);
            holder.list_itease_layout = (RelativeLayout) convertView.findViewById(R.id.list_itease_layout);
            holder.motioned = (TextView) convertView.findViewById(R.id.mentioned);
            holder.top_flag =  convertView.findViewById(R.id.top_flag);
            convertView.setTag(holder);
        }

        // get conversation
        EMConversation conversation = getItem(position);
        // get username or group id
        String username = conversation.conversationId();
        String field = conversation.getExtField();
        ConversationExtBean extBean = Json_U.fromJson(field, ConversationExtBean.class);
        if (conversation.getType() == EMConversation.EMConversationType.GroupChat) {
            EMGroup group = EMClient.getInstance().groupManager().getGroup(username);
            String description = group.getDescription();
            if (!TextUtils.isEmpty(description)) {
                System.out.println("groupId"+group.getGroupId());
                System.out.println("descriptions:"+description);
                GroupChatExtBean groupChatExtBean = Json_U.fromJson(description, GroupChatExtBean.class);
                if (groupChatExtBean.groupType == EaseConstant.ORDER_CHAT) {
                    if (groupChatExtBean.orderType == 1) {
                        holder.avatar.setImageResource(R.drawable.ic_order_type_toshop);
                    } else {
                        holder.avatar.setImageResource(R.drawable.ic_order_type_deliver);
                    }
                } else {
                    holder.avatar.setImageResource(R.drawable.em_group_icon);
                }
            } else {
                holder.avatar.setImageResource(R.drawable.em_group_icon);
            }
            holder.name.setText(group != null ? group.getGroupName() : username);
        } else if (conversation.getType() == EMConversation.EMConversationType.ChatRoom) {
            holder.avatar.setImageResource(R.drawable.em_group_icon);
            EMChatRoom room = EMClient.getInstance().chatroomManager().getChatRoom(username);
            holder.name.setText(room != null && !TextUtils.isEmpty(room.getName()) ? room.getName() : username);
            holder.motioned.setVisibility(View.GONE);
        } else {
            String header = null;
            String nick = null;

            EaseUserUtils.setUserAvatar(getContext(), username, holder.avatar);
            EaseUserUtils.setUserNick(getContext(), username, holder.name);
            holder.motioned.setVisibility(View.GONE);
        }

        if(extBean.isTop){
            holder.top_flag.setVisibility(View.VISIBLE);
        }else {
            holder.top_flag.setVisibility(View.INVISIBLE);
        }

        if (conversation.getUnreadMsgCount() > 0) {
            // show unread message count
            holder.unreadLabel.setText(String.valueOf(conversation.getUnreadMsgCount()));
            holder.unreadLabel.setVisibility(View.VISIBLE);
        } else {
            holder.unreadLabel.setVisibility(View.INVISIBLE);
        }


        if (conversation.getAllMsgCount() != 0) {
            // show the message of latest message
            EMMessage lastMessage = conversation.getLastMessage();
            String content = null;
            holder.message.setText(EaseSmileUtils.getSmiledText(getContext(), EaseCommonUtils.getMessageDigest(lastMessage, (getContext()))),
                    TextView.BufferType.SPANNABLE);
            if (content != null) {
                holder.message.setText(content);
            }

            holder.time.setText(DateUtils.getTimestampString(new Date(lastMessage.getMsgTime())));
            if (lastMessage.direct() == EMMessage.Direct.SEND && lastMessage.status() == EMMessage.Status.FAIL) {
                holder.msgState.setVisibility(View.VISIBLE);
            } else {
                holder.msgState.setVisibility(View.GONE);
            }
        }
        return convertView;
    }

    private static class ViewHolder {
        /**
         * who you chat with
         */
        TextView name;
        /**
         * unread message count
         */
        TextView unreadLabel;
        /**
         * message of last message
         */
        TextView message;
        /**
         * time of last message
         */
        TextView time;
        /**
         * avatar
         */
        ImageView avatar;
        /**
         * status of last message
         */
        View msgState;
        View top_flag;
        /**
         * layout
         */
        RelativeLayout list_itease_layout;
        TextView motioned;
    }

    private EaseConversationListHelper conversationListHelper;


    public interface EaseConversationListHelper {
        /**
         * set message of second line
         *
         * @param lastMessage
         * @return
         */
        String onSetItemSecondaryText(EMMessage lastMessage);
    }

    public void setConversationListHelper(EaseConversationListHelper helper) {
        conversationListHelper = helper;
    }
}
