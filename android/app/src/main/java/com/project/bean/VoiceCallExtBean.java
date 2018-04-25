package com.project.bean;

import com.project.config.Const;
import com.project.util.SPUtil;

/**
 * Created by sshss on 2017/12/27.
 */

public class VoiceCallExtBean {
    public String groupId;
    public String userpicurlhx;
    public String usernicknamehx;

    public VoiceCallExtBean() {
        userpicurlhx = SPUtil.getString(Const.USER_HEADER, "");
        usernicknamehx = SPUtil.getString(Const.USER_NICK, "");
    }
}
