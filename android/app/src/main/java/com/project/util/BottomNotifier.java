package com.project.util;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ValueAnimator;
import android.os.Build;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.TranslateAnimation;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.hyphenate.chat.EMClient;
import com.project.MainActivity;
import com.project.R;

import java.util.ArrayList;

/**
 * Created by sshss on 2017/12/29.
 */

public class BottomNotifier {
    private static BottomNotifier sInstance;
    private MainActivity mActivity;
    private int mMsgWidth;
    private TextView tv_notify;
    private TranslateAnimation mDismisAnim;
    private TranslateAnimation mShowAnim;
    private AnimatorSet animatorSet;

    private ArrayList<Animator> mAnimList;
    private ValueAnimator animatorDismiss;
    private ValueAnimator animatorShow;
    private ValueAnimator animatorTmp;

    private BottomNotifier() {

    }

    public static BottomNotifier getInstance() {
        if (sInstance == null)
            sInstance = new BottomNotifier();
        return sInstance;
    }

    public void init(MainActivity activity) {
        mActivity = activity;
        View toastRoot = LayoutInflater.from(mActivity).inflate(R.layout.item_order_notify, null);
        tv_notify = (TextView) toastRoot.findViewById(R.id.tv_notify);
        ViewGroup parentGroup;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            parentGroup = (ViewGroup) mActivity.findViewById(android.R.id.content);

        } else {
            parentGroup = (ViewGroup) mActivity.getWindow().getDecorView();
        }
        parentGroup.addView(toastRoot);
        mMsgWidth = Dip2PxUtils.dip2px(mActivity, 110);
        tv_notify.setVisibility(View.INVISIBLE);

        mDismisAnim = new TranslateAnimation(0, mMsgWidth, 0, 0);
        mDismisAnim.setDuration(200);
        mDismisAnim.setInterpolator(new DecelerateInterpolator());
        mDismisAnim.setFillAfter(true);
        mShowAnim = new TranslateAnimation(mMsgWidth, 0, 0, 0);
        mShowAnim.setDuration(200);
        mShowAnim.setInterpolator(new DecelerateInterpolator());
        mShowAnim.setFillAfter(true);

        ValueAnimator.AnimatorUpdateListener animatorUpdateListener = new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                int value = (int) animation.getAnimatedValue();
                RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) tv_notify.getLayoutParams();
                layoutParams.setMargins(0, 0, value, layoutParams.bottomMargin);
                System.out.println("getAnimated：" + value);
                tv_notify.setLayoutParams(layoutParams);
            }
        };
        animatorShow = ValueAnimator.ofInt(-mMsgWidth, 0);
        animatorShow.setDuration(200);
        animatorShow.setInterpolator(new DecelerateInterpolator());
        animatorShow.addUpdateListener(animatorUpdateListener);
        animatorDismiss = ValueAnimator.ofInt(0, -mMsgWidth);
        animatorDismiss.setDuration(200);
        animatorDismiss.setInterpolator(new DecelerateInterpolator());
        animatorDismiss.addUpdateListener(animatorUpdateListener);
        animatorTmp = ValueAnimator.ofFloat(0, 1);
        animatorTmp.setDuration(2000);
        mAnimList = new ArrayList<>();
        mAnimList.add(animatorShow);
        mAnimList.add(animatorDismiss);
        mAnimList.add(animatorTmp);
        animatorSet = new AnimatorSet();
    }


    public void nofify() {
        nofify(null);
    }
    public void nofify(final String message) {
        synchronized (sInstance) {
            if (mActivity != null && !mActivity.isFinishing()) {
                mActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (mActivity.isTaskRoot())
                            if (animatorSet != null) {
                                animatorSet.cancel();
                                tv_notify.setVisibility(View.VISIBLE);
                                if (TextUtils.isEmpty(message))
                                    tv_notify.setText(EMClient.getInstance().chatManager().getUnreadMessageCount() + "条新消息");
                                else
                                    tv_notify.setText(message);
                                animatorSet.play(animatorShow);
                                animatorSet.play(animatorDismiss).after(animatorShow).after(2000);
//                    animatorSet.setDuration(500);
                                animatorSet.start();
                            }
                    }
                });
            }
        }
    }
}
