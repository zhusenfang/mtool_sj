package com.project.view.customview;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.RelativeLayout;

/**
 * Created by sshss on 2017/12/29.
 */

public class RnRelativeLayout extends RelativeLayout {
    public RnRelativeLayout(Context context) {
        super(context);
    }

    public RnRelativeLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public RnRelativeLayout(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        super.onLayout(changed, l, t, r, b);
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(new Runnable() {
            @Override
            public void run() {
                measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                        MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
                layout(getLeft(), getTop(), getRight(), getBottom());
            }
        });
    }
}
