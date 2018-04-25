package com.project.util;

import android.content.Context;
import android.text.TextUtils;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.project.R;
import com.project.chat.domain.EaseUser;
import com.project.chat.util.StrangersCachUtil;

public class EaseUserUtils {

//    static EaseUserProfileProvider userProvider;
//
//    static {
//        userProvider = EaseUI.getInstance().getUserProfileProvider();
//    }

    /**
     * get EaseUser according username
     *
     * @param username
     * @return
     */
//    public static EaseUser getUserInfo(String username) {
//        if (userProvider != null)
//            return userProvider.getUser(username);
//
//        return null;
//    }

    /**
     * set user avatar
     *
     * @param username
     */
    public static void setUserAvatar(Context context, String username, ImageView imageView) {
//        EaseUser user = getUserInfo(username);
//        if (user != null && !TextUtils.isEmpty(user.getAvatar())) {
//            try {
////                int avatarResId = Integer.parseInt(user.getAvatar());
////                Glide.with(context).load(avatarResId).into(imageView);
//                String url = user.getAvatar();
//                Glide.with(context).load(url).into(imageView);
//            } catch (Exception e) {
//                //use default avatar
//                imageView.setImageResource(R.drawable.ease_default_avatar);
//            }
//        } else {
        EaseUser user = StrangersCachUtil.getUser(context, username);
        if (user != null && !TextUtils.isEmpty(user.getAvatar())) {
            try {
                Glide.with(context).load(user.getAvatar()).into(imageView);
            } catch (Exception e) {
                //use default avatar
                imageView.setImageResource(R.drawable.ease_default_avatar);
            }
        } else {
            imageView.setImageResource(R.drawable.ease_default_avatar);
        }
//        }
    }

    /**
     * set user's nickname
     */
    public static void setUserNick(Context context, String username, TextView textView) {
        if (textView != null) {
//            EaseUser user = getUserInfo(username);
//            if (user != null && !username.equals(user.getNick())) {
//                textView.setText(user.getNick());
//            } else {
            EaseUser user = StrangersCachUtil.getUser(context, username);
            if (user != null && !TextUtils.isEmpty(user.getAvatar())) {
                textView.setText(user.getNick());
            } else {
                textView.setText(username);
            }
        }
    }

//    public static void setUserNick(String username, TextView textView) {
//        if (textView != null) {
//            EaseUser user = getUserInfo(username);
//            if (user != null && user.getNick() != null) {
//                textView.setText(user.getNick());
//            } else {
//                textView.setText(username);
//            }
//        }
//    }

}
