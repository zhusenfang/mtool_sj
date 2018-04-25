package com.project.util;

import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.project.MyApplication;

/**
 * Created by sshss on 2017/10/17.
 */

public class LocateUtil {
    private AMapLocationClient mlocationClient;
    private AMapLocationClientOption mLocationOption;

    private LocateUtil(AMapLocationListener listener) {
        if (mlocationClient == null) {
            mLocationOption = new AMapLocationClientOption();
            mlocationClient = new AMapLocationClient(MyApplication.getContext());
            mlocationClient.setLocationListener(listener);
            mLocationOption.setOnceLocation(true);
            mLocationOption.setLocationCacheEnable(false);
            mlocationClient.setLocationOption(mLocationOption);
        }

    }

    public void locate(){
        mlocationClient.startLocation();
    }

    public static LocateUtil getInstance(AMapLocationListener listener) {
        return new LocateUtil(listener);
    }
}
