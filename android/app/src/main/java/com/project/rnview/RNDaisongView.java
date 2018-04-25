package com.project.rnview;

import android.view.View;
import android.widget.FrameLayout;

import com.amap.api.maps.AMap;
import com.amap.api.maps.CameraUpdateFactory;
import com.amap.api.maps.TextureMapView;
import com.amap.api.maps.model.BitmapDescriptorFactory;
import com.amap.api.maps.model.CameraPosition;
import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.LatLngBounds;
import com.amap.api.maps.model.MarkerOptions;
import com.amap.api.services.core.LatLonPoint;
import com.amap.api.services.nearby.NearbyInfo;
import com.amap.api.services.nearby.NearbySearch;
import com.amap.api.services.nearby.NearbySearchFunctionType;
import com.amap.api.services.nearby.NearbySearchResult;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.project.MyApplication;
import com.project.R;
import com.project.util.ToastUtils;

import java.util.List;

/**
 * Created by sshss on 2017/11/10.
 */

public class RNDaisongView extends FrameLayout implements LifecycleEventListener, AMap.OnMapLoadedListener, AMap.OnCameraChangeListener {
    private AMap mMap;
    private TextureMapView mMapView;
    private ThemedReactContext mContext;
    private View mMainView;

    private NearbySearch.NearbyListener mNearbyListener = new NearbySearch.NearbyListener() {
        @Override
        public void onUserInfoCleared(int i) {

        }

        @Override
        public void onNearbyInfoSearched(NearbySearchResult nearbySearchResult, int resultCode) {
            if (resultCode == 1000) {
                if (nearbySearchResult != null
                        && nearbySearchResult.getNearbyInfoList() != null
                        && nearbySearchResult.getNearbyInfoList().size() > 0) {
                    List<NearbyInfo> nearbyInfoList = nearbySearchResult.getNearbyInfoList();
//                    NearbyInfo nearbyInfo = nearbyInfoList.get(0);
//                    System.out.println("周边搜索结果为size " + nearbySearchResult.getNearbyInfoList().size()
//                            + " first：" + nearbyInfo.getUserID() + "  " + nearbyInfo.getDistance() + "  "
//                            + nearbyInfo.getDrivingDistance() + "  " + nearbyInfo.getTimeStamp() + "  " +
//                            nearbyInfo.getPoint().toString());


                    LatLngBounds.Builder b = LatLngBounds.builder();
                    for (int i = 0; i < nearbyInfoList.size(); i++) {

                        NearbyInfo nearbyInfo1 = nearbyInfoList.get(i);
                        LatLng latLng = new LatLng(nearbyInfo1.getPoint().getLatitude(), nearbyInfo1.getPoint().getLongitude());
                        b.include(latLng);
                        View view = View.inflate(mContext, R.layout.item_poi, null);
                        mMap.addMarker(new MarkerOptions()
                                .position(latLng)
                                .icon(BitmapDescriptorFactory.fromView(view))
                                .infoWindowEnable(false));
                    }
                    LatLngBounds bounds = b.build();
                    mMap.moveCamera(CameraUpdateFactory.newLatLngBounds(bounds, 30));

                    showCount(nearbyInfoList.size());
                } else {
                    System.out.println("周边没有配送员");
                    showCount(0);
                }
            } else if (resultCode == 1802) {
                ToastUtils.showToast("连接超时，请稍后再试");
            } else {
                showCount(0);
                System.out.println("周边搜索出现异常，异常码为：" + resultCode);
            }
        }

        @Override
        public void onNearbyInfoUploaded(int i) {

        }
    };

    /**
     * 配送员数量
     *
     * @param size
     */
    private void showCount(int size) {
        WritableMap event = Arguments.createMap();
        event.putInt("count", size);
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("data", event);
    }

    /**
     * 获取店铺位置
     *
     * @param latitud
     * @param longitude
     */

    public void setShopLocation(double latitud, double longitude) {
        LatLng latLng = new LatLng(latitud, longitude);
        mMap.moveCamera(CameraUpdateFactory.newLatLng(latLng));
        mMap.moveCamera(CameraUpdateFactory.zoomTo(18));
        mMap.addMarker(new MarkerOptions().position(latLng)
                .icon((BitmapDescriptorFactory.fromView(View.inflate(mContext, R.layout.item_my_loacteion, null)))));

        //获取附近实例（单例模式）
        NearbySearch mNearbySearch = NearbySearch.getInstance(mContext);
        NearbySearch.getInstance(mContext).addNearbyListener(mNearbyListener);
        //设置搜索条件
        NearbySearch.NearbyQuery query = new NearbySearch.NearbyQuery();
        //设置搜索的中心点
        query.setCenterPoint(new LatLonPoint(latitud, longitude));
        //设置搜索的坐标体系
        query.setCoordType(NearbySearch.AMAP);
        //设置搜索半径
        query.setRadius(5000);
        //设置查询的时间
        query.setTimeRange(10000);
        //设置查询的方式驾车还是距离
        query.setType(NearbySearchFunctionType.DISTANCE_SEARCH);
        //调用异步查询接口
        mNearbySearch.searchNearbyInfoAsyn(query);

    }


    public RNDaisongView(ThemedReactContext context) {
        super(context);
        mContext = context;
        mContext.addLifecycleEventListener(this);

        mMainView = View.inflate(mContext, R.layout.layout_daisong, null);
        addView(mMainView);
        mMapView = (TextureMapView) mMainView.findViewById(R.id.map_view);
        if (MyApplication.getInstance().bundle == null) {
            MyApplication.getInstance().bundle = mContext.getCurrentActivity().getIntent().getExtras();
        }
        mMapView.onCreate(MyApplication.getInstance().bundle);

        mMapView.getMap().setOnMapLoadedListener(this);
        mContext.addLifecycleEventListener(this);
        mMapView.onResume();
//        System.out.println("mapview count: "+);
        mMap = mMapView.getMap();

        mMap.getUiSettings().setZoomControlsEnabled(false);
        mMap.getUiSettings().setRotateGesturesEnabled(false);
        mMap.getUiSettings().setTiltGesturesEnabled(false);
        mMap.setOnCameraChangeListener(this);

    }


    @Override
    protected void onAttachedToWindow() {

        super.onAttachedToWindow();

    }

    @Override
    public void onWindowFocusChanged(boolean hasWindowFocus) {
        System.out.println("hasWindowFocus: "+hasWindowFocus);
        super.onWindowFocusChanged(hasWindowFocus);

//        if (hasWindowFocus) {
//            System.out.println("onResume");
//            mMapView.onResume();
//        } else {
//            //对应onPause
//            System.out.println("onPause");
//            mMapView.onPause();
//        }
    }

    @Override
    protected void onWindowVisibilityChanged(int visibility) {
        System.out.println("visibility: "+visibility);
        super.onWindowVisibilityChanged(visibility);
        if (visibility == VISIBLE) {
            System.out.println("onResume");
            mMapView.onResume();
        } else {
            System.out.println("onPause");
            mMapView.onPause();
        }
    }


    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        mMapView.onDestroy();
    }

    @Override
    public void onMapLoaded() {
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onViewLoaded", Arguments.createMap());
    }

    @Override
    public void onHostResume() {
        System.out.println("onHostResume");
    }

    @Override
    public void onHostPause() {
        System.out.println("onHostPause");
    }

    @Override
    public void onHostDestroy() {
        System.out.println("onHostDestroy");
    }

    @Override
    public void onCameraChange(CameraPosition cameraPosition) {

    }

    @Override
    public void onCameraChangeFinish(CameraPosition cameraPosition) {

    }
}
