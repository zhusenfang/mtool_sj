package com.project.chat.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;

import com.project.chat.domain.EaseUser;
import com.project.util.Json_U;

/**
 * Created by sshss on 2017/12/19.
 */

public class StrangersCachUtil {
    private static SharedPreferences sp;

    public static EaseUser getUser(Context context, String hxId) {
        if (sp == null) {
            sp = context.getSharedPreferences("mtool_strangers", Context.MODE_PRIVATE);
        }
        String string = sp.getString(hxId, "");
        if (!TextUtils.isEmpty(string)) {
            return Json_U.fromJson(string, EaseUser.class);
        }
        return null;
    }

    public static void putUser(Context context, String hxId, String nick, String avatar) {
        if (sp == null) {
            sp = context.getSharedPreferences("mtool_strangers", Context.MODE_PRIVATE);
        }
        EaseUser easeUser = new EaseUser(hxId);
        easeUser.setNickname(nick);
        easeUser.setAvatar(avatar);
        String s = Json_U.toJson(easeUser);
        sp.edit().putString(hxId, s).apply();
    }
}
