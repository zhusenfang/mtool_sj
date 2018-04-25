package com.project.activity;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.project.MyApplication;
import com.project.R;
import com.project.bean.ErrorBean;
import com.project.customview.MainMenu;
import com.project.customview.StateView;



/**
 * Created by sshss on 2017/6/23.
 */

public abstract class BaseActivity extends FragmentActivity {
    public StateView mStateView;
    private ViewGroup mBaseView;
    public MainMenu mMainMenu;

    public abstract int getContentRes();

    public abstract void initViews();

    public void initNet() {

    }

    public abstract void onReload();


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MyApplication.getInstance().addActivity(this);
        mBaseView = (ViewGroup) View.inflate(this, R.layout.base_layout, null);
        mBaseView.findViewById(R.id.ic_left).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onFinishAct();
            }
        });
        ViewGroup fr_content = (ViewGroup) mBaseView.findViewById(R.id.fr_base_content);
        View contentView = View.inflate(this, getContentRes(), null);
        fr_content.addView(contentView);
        mStateView = new StateView(this) {
            @Override
            public void onReload() {
                BaseActivity.this.onReload();
            }
        };
        fr_content.addView(mStateView);
        setContentView(mBaseView);
//        StatusBarUtil.setStatuBarColor(this, Color.BLACK, 0);
        initViews();
        initNet();
    }

    @Override
    public void onBackPressed() {
        if (mMainMenu != null && mMainMenu.isShow()) {
            mMainMenu.dismiss(true);
        } else {
            super.onBackPressed();
        }
    }

    /**
     * 默认实现返回关闭activity
     */
    public void onFinishAct() {
        finish();
    }

    /**
     * 标题设置
     *
     * @param title
     */
    public void setMainTitle(String title) {
        ((TextView) mBaseView.findViewById(R.id.tv_main_title)).setText(title);
    }

    public void setMainTitleGone() {
        mBaseView.findViewById(R.id.tv_main_title).setVisibility(View.INVISIBLE);
    }

    /**
     * 是否添加主导航按钮
     */
    public void setMainMenuEnable() {
        mMainMenu = new MainMenu(this);
//        ViewGroup decorView = (ViewGroup) getWindow().getDecorView();
        mBaseView.addView(mMainMenu);
    }

    public void setMainMenuEnable(MainMenu menu) {
        mMainMenu = menu;
    }

    /**
     * 设置主导航菜单二级菜单
     *
     * @param imgRes
     * @param titles
     * @param listener
     */
    public void setSecMenu(int[] imgRes, String[] titles, View.OnClickListener listener) {
        if (mMainMenu != null)
            mMainMenu.setSecondMenu(imgRes, titles, listener);
    }

    public void setTitleDisable() {
//        mBaseView.findViewById(R.id.title_layout).setVisibility(View.GONE);
        mBaseView.removeView(mBaseView.findViewById(R.id.title_layout));
    }

    public StateView getStateView() {
        return mStateView;
    }

    public void showProgress(boolean toShow) {
        if (toShow)
            mStateView.setCurrentState(StateView.ResultState.LOADING);
        else
            mStateView.setCurrentState(StateView.ResultState.SUCESS);
    }

    public void showError(ErrorBean errorBean) {
        mStateView.setCurrentState(StateView.ResultState.ERROR);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        MyApplication.getInstance().removeAvctivity(this);
    }
}
