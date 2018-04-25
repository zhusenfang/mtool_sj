package com.project.rnview;

import android.content.Context;
import android.content.Intent;
import android.support.annotation.AttrRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.amap.api.maps.AMap;
import com.amap.api.maps.TextureMapView;
import com.amap.api.maps.model.CameraPosition;
import com.amap.api.services.core.PoiItem;
import com.amap.api.services.geocoder.GeocodeResult;
import com.amap.api.services.geocoder.GeocodeSearch;
import com.amap.api.services.geocoder.RegeocodeResult;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.project.MyApplication;
import com.project.R;
import com.project.adapter.LocateNeayByAdapter;
import com.project.bean.ErrorBean;
import com.project.config.Const;
import com.project.presenter.AddressLocatePresenter;
import com.project.util.InputUtils;
import com.project.view.IAddressLocateView;

import java.util.List;

/**
 * Created by sshss on 2017/10/29.
 */

public class RNAddressLocateView extends FrameLayout implements
        View.OnClickListener, AMap.OnCameraChangeListener, AMap.OnMapLoadedListener,
        GeocodeSearch.OnGeocodeSearchListener, IAddressLocateView {
    private AddressLocatePresenter mPresenter;
    private ThemedReactContext mContext;
    TextureMapView mMapView;
    ListView mListView;
    View mIconLocate;
    ProgressBar mLocatePb;
    View mAddPb;
    EditText mEtSearch;
    private View mMainView;
    private GeocodeSearch geocodeSearch;
    private LocateNeayByAdapter mAdapter;
    private List<PoiItem> mDataList;

    public RNAddressLocateView(ThemedReactContext context) {
        super(context);
        mContext = context;
    }

    public RNAddressLocateView(@NonNull Context context) {
        this(context, null);
    }

    public RNAddressLocateView(@NonNull Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public RNAddressLocateView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr) {
        super(context, attrs, defStyleAttr);

    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        mMainView = View.inflate(mContext, R.layout.activity_address_locate, null);
        addView(mMainView);
        mMapView = (TextureMapView) mMainView.findViewById(R.id.map_view);
        mPresenter = new AddressLocatePresenter(this, mMapView.getMap());
        mMapView.getMap().getUiSettings().setZoomControlsEnabled(false);
        mMapView.getMap().getUiSettings().setRotateGesturesEnabled(false);
        mMapView.getMap().getUiSettings().setTiltGesturesEnabled(false);
        mMapView.onCreate(mContext.getCurrentActivity().getIntent().getExtras());
        mListView = (ListView) mMainView.findViewById(R.id.lv_list);
        mIconLocate = mMainView.findViewById(R.id.icon_locate);
        mLocatePb = (ProgressBar) mMainView.findViewById(R.id.locate_pb);
        mEtSearch = (EditText) mMainView.findViewById(R.id.search_main);
        mAddPb = mMainView.findViewById(R.id.layout_pb);
        mMainView.findViewById(R.id.icon_locate).setOnClickListener(this);

        mEtSearch.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH || (event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                    if (!TextUtils.isEmpty(mEtSearch.getText().toString().trim())) {
                        InputUtils.hideInput(mContext, mEtSearch);
                        mPresenter.search(mEtSearch.getText().toString().trim(), false);
                    }
                    return true;
                }
                return false;
            }
        });
        geocodeSearch = new GeocodeSearch(MyApplication.getInstance());
        geocodeSearch.setOnGeocodeSearchListener(this);
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
    public void onRegeocodeSearched(RegeocodeResult regeocodeResult, int rCode) {
        showProgress(false);

    }

    @Override
    public void onGeocodeSearched(GeocodeResult geocodeResult, int i) {

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.icon_locate:
                mPresenter.locate();
                break;
        }
    }

    @Override
    public void onCameraChange(CameraPosition cameraPosition) {

    }

    @Override
    public void onCameraChangeFinish(CameraPosition cameraPosition) {
        mPresenter.onCameraChangeFinish(cameraPosition);
    }

    @Override
    public void onMapLoaded() {
        mPresenter.locate();
    }

    @Override
    public void showLocatePb(boolean show) {
        if (show)
            mLocatePb.setVisibility(View.VISIBLE);
        else
            mLocatePb.setVisibility(View.INVISIBLE);
    }

    @Override
    public void showProgress(boolean toShow) {
        int visble = toShow ? View.VISIBLE : View.INVISIBLE;
        mAddPb.setVisibility(visble);
    }

    @Override
    public void showError(ErrorBean errorBean) {

    }

    @Override
    public void showAddressInfo(List<PoiItem> poiItems) {
        if (mAdapter == null) {
            mDataList = poiItems;
            mAdapter = new LocateNeayByAdapter(mContext, mDataList);
            mListView.setAdapter(mAdapter);
            mListView.scrollTo(0, 1);
            mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    PoiItem poiItem = mDataList.get(position);
                    Intent intent = new Intent();
                    intent.putExtra(Const.LOC_INFO, poiItem);
                    WritableMap event = Arguments.createMap();
                    event.putString("address", poiItem.getSnippet());
                    event.putDouble("latitude", poiItem.getLatLonPoint().getLatitude());
                    event.putDouble("longitude", poiItem.getLatLonPoint().getLongitude());
                    mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("data", event);
                }
            });
        } else {
            mDataList.clear();
            mDataList.addAll(poiItems);
            mAdapter.notifyDataSetChanged();
        }
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

    @Override
    public Context getMyContext() {
        return mContext;
    }
}
