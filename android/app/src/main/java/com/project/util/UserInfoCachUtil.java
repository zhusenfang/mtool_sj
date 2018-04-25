package com.project.util;


import com.project.bean.LoginBean;
import com.project.config.Const;

/**
 * Created by sshss on 2017/10/25.
 */

public class UserInfoCachUtil {
    public static void cachInfo(LoginBean bean){
        SPUtil.putString(Const.USER_PHONE,bean.data.username);
        SPUtil.putString(Const.USER_HEADER, bean.data.picUrl);
        SPUtil.putString(Const.USER_NICK, bean.data.nickname);
        SPUtil.putString(Const.USER_INTRO, bean.data.introduction);
        SPUtil.putInt(Const.USER_SEX, bean.data.sex);
        SPUtil.putLong(Const.USER_BIRTH, bean.data.birthday);
        SPUtil.putString(Const.USER_ADD, bean.data.userAddr);
    }
}
