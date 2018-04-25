package com.project.bean;

import com.project.MyApplication;
import com.project.R;

/**
 * Created by sshss on 2017/6/30.
 */

public class ErrorBean {
    public int code = -1;
    public String msg;
    public String url;

    public ErrorBean(){
        msg = MyApplication.getInstance().getString(R.string.res_err) + code;
    }
    public ErrorBean(int code, String url) {
        msg = MyApplication.getInstance().getString(R.string.res_err) + code;
        this.url = url;
    }

    public ErrorBean(String msg, String url) {
        this.msg = msg;
        this.url = url;
    }
}
