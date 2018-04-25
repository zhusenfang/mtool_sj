package com.project.rnview;

import android.content.Context;
import android.support.annotation.AttrRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.TextView;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationListener;
import com.amap.api.maps.AMap;
import com.amap.api.maps.TextureMapView;
import com.amap.api.maps.model.BitmapDescriptorFactory;
import com.amap.api.maps.model.CameraPosition;
import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.MarkerOptions;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.project.R;
import com.project.bean.BusShareLocBean;
import com.project.util.LocateUtil;
import com.project.util.ToastUtils;

import org.greenrobot.eventbus.EventBus;

/**
 * Created by sshss on 2017/10/29.
 */

public class LocationShareView extends FrameLayout implements
        View.OnClickListener, AMap.OnCameraChangeListener, AMap.OnMapLoadedListener {
    private ThemedReactContext mContext;
    TextureMapView mMapView;
    View mAddPb;
    private View mMainView;
    TextView tv_section;
    TextView tv_address;
    private AMapLocation mMapLocation;

    public LocationShareView(ThemedReactContext context) {
        super(context);
        mContext = context;
    }

    public LocationShareView(@NonNull Context context) {
        this(context, null);
    }

    public LocationShareView(@NonNull Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public LocationShareView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        mMainView = View.inflate(mContext, R.layout.activity_locate_share, null);
        addView(mMainView);
        mMapView = (TextureMapView) mMainView.findViewById(R.id.map_view);
        tv_section = (TextView) mMainView.findViewById(R.id.tv_section);
        tv_address = (TextView) mMainView.findViewById(R.id.tv_address);
        mMapView.getMap().getUiSettings().setZoomControlsEnabled(false);
        mMapView.getMap().getUiSettings().setRotateGesturesEnabled(false);
        mMapView.getMap().getUiSettings().setTiltGesturesEnabled(false);
        mMapView.onCreate(mContext.getCurrentActivity().getIntent().getExtras());
        mAddPb = mMainView.findViewById(R.id.layout_pb);
        mMainView.findViewById(R.id.tv_share).setOnClickListener(this);

        mMapView.getMap().setOnMapLoadedListener(this);
        mMapView.getMap().setOnCameraChangeListener(this);
        mMapView.onResume();
    }
    @Override
    public void onWindowFocusChanged(boolean hasWindowFocus) {
        if (hasWindowFocus) {
//            对应onResume
            System.out.println("RNAddressLocateView onResume");
            mMapView.onResume();
        } else {
            //对应onPause
            System.out.println("RNAddressLocateView onPause");
            mMapView.onPause();
        }
        super.onWindowFocusChanged(hasWindowFocus);

    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        System.out.println("RNAddressLocateView onDestroy");
        mMapView.onDestroy();
    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.tv_share:
                if (mMapLocation != null) {
                    WritableMap event = Arguments.createMap();
                    event.putString("action", "finish");
                    mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("event", event);
                    EventBus.getDefault().post(new BusShareLocBean(mMapLocation.getLatitude(), mMapLocation.getLongitude(), mMapLocation.getAddress()));
                }
                break;
        }
    }

    @Override
    public void onCameraChange(CameraPosition cameraPosition) {

    }

    @Override
    public void onCameraChangeFinish(CameraPosition cameraPosition) {

    }

    @Override
    public void onMapLoaded() {
        LocateUtil.getInstance(new AMapLocationListener() {
            @Override
            public void onLocationChanged(AMapLocation aMapLocation) {
                mAddPb.setVisibility(INVISIBLE);
                if (aMapLocation.getErrorCode() == 0) {
                    mMapLocation = aMapLocation;
                    tv_section.setText(aMapLocation.getPoiName());
                    tv_address.setText(aMapLocation.getAddress());
                    mMapView.getMap().addMarker(new MarkerOptions()
                            .position(new LatLng(aMapLocation.getLatitude(), aMapLocation.getLongitude()))
                            .icon(BitmapDescriptorFactory.fromResource(R.mipmap.ic_my_location)));
                } else {
                    ToastUtils.showToast("获取当前位置失败");
                }
            }
        }).locate();
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
