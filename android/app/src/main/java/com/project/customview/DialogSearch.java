package com.project.customview;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;

import com.project.R;

/**
 * Created by sshss on 2017/8/29.
 */

public class DialogSearch implements View.OnClickListener {

    private Context mContext;
    private AlertDialog alertDialog;

    public DialogSearch(Context context) {
        mContext = context;
        alertDialog = new AlertDialog.Builder(context).create();
        alertDialog.show();
        alertDialog.setCancelable(true);
    }

    public void show() {
        alertDialog.show();
        alertDialog.setContentView(R.layout.dialog_search);
        alertDialog.findViewById(R.id.iv_cancle).setOnClickListener(this);
        alertDialog.findViewById(R.id.state).setOnClickListener(this);
        alertDialog.findViewById(R.id.order).setOnClickListener(this);
        alertDialog.findViewById(R.id.supported).setOnClickListener(this);
        alertDialog.findViewById(R.id.collection).setOnClickListener(this);
        alertDialog.findViewById(R.id.contact).setOnClickListener(this);
        Window window = alertDialog.getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM);//有edittext必须加这一条
        window.setWindowAnimations(R.style.up_down_anim_pop);
        window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));//布局背景透明
        WindowManager.LayoutParams attributes = window.getAttributes();//宽度要show完之后在设
        attributes.width = ViewGroup.LayoutParams.MATCH_PARENT;//在这定义宽度才可以居中
        attributes.height = ViewGroup.LayoutParams.MATCH_PARENT;
        attributes.gravity = Gravity.CENTER;
        alertDialog.onWindowAttributesChanged(attributes);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.iv_cancle:
                alertDialog.dismiss();
                break;
            case R.id.state:
                sendBroadCast("search_state");
                break;
            case R.id.order:
                sendBroadCast("search_order");
                break;
            case R.id.supported:
                sendBroadCast("search_supported");
                break;
            case R.id.collection:
                sendBroadCast("search_collection");
                break;
            case R.id.contact:
                sendBroadCast("search_contact");
                break;


        }
        alertDialog.dismiss();
    }

    private void sendBroadCast(String action) {
        Intent intent = new Intent("action.mapmodule");
        intent.putExtra("action", action);
        mContext.sendBroadcast(intent);
    }

}
