package com.project.model;

import android.os.Message;
import android.util.Log;

import com.google.gson.Gson;
import com.project.MyApplication;
import com.project.R;
import com.project.bean.ErrorBean;
import com.project.config.API;
import com.project.http.PersistentCookieStore;
import com.project.presenter.IPresenter;
import com.zhy.http.okhttp.OkHttpUtils;
import com.zhy.http.okhttp.callback.StringCallback;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.Dispatcher;
import okhttp3.HttpUrl;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;

import static android.R.attr.tag;

/**
 * Created by sshss on 2017/6/23.
 */

public class HttpModel {
    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private IPresenter mPresenter;
    private PersistentCookieStore mCookieStore;
    private OkHttpClient mClient;
    private Call mLastCall;
    private static final String TAG = "HttpModel";
    private Object mLastRequestBean;

    public HttpModel(IPresenter presenter) {
        mPresenter = presenter;
        mCookieStore = new PersistentCookieStore(MyApplication.getInstance());

        HttpLoggingInterceptor httpLoggingInterceptor = new HttpLoggingInterceptor();
        httpLoggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY
        );
        mClient = new OkHttpClient.Builder()
                .cookieJar(new CookieJar() {
                    @Override
                    public void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
                        if (cookies != null && cookies.size() > 0) {
                            for (Cookie item : cookies) {
                                mCookieStore.add(url, item);
                            }
                        }
                    }

                    @Override
                    public List<Cookie> loadForRequest(HttpUrl url) {
                        return mCookieStore.get(url);
                    }
                })
                .addInterceptor(httpLoggingInterceptor)
                .connectTimeout(15, TimeUnit.SECONDS)
                .build();

    }


    public void request(String url, Object requestBean) {
        request(url, requestBean, null, null, null);
    }

    public void request(String url, Object requestBean, Object tag) {
        request(url, requestBean, null, null, tag);
    }


    public void request(String url, Object requestBean, Request request, Callback callback, Object tag) {
        RequestBody requestBody;
        if (requestBean != null) {
            requestBody = RequestBody.create(JSON, new Gson().toJson(requestBean));
        } else {
            requestBody = RequestBody.create(JSON, "");
        }
        mLastRequestBean = requestBean;
        if (request == null) {
            request = new Request.Builder()
                    .url(url)
                    .post(requestBody)
                    .build();
        }
        if (callback == null)
            callback = getDefaultCallBack(tag);
        mClient.newCall(request).enqueue(callback);
//        try {
//            Response execute = mClient.newCall(request).execute();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
    }

    private Callback getDefaultCallBack(final Object tag) {
        return new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                if (mPresenter != null) {
                    String url = call.request().url().toString();
                    mPresenter.onConnectFaild(new ErrorBean(MyApplication.getInstance().getString(R.string.net_err), url));
                }
                e.printStackTrace();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String url = call.request().url().toString();
                if (mPresenter != null) {
                    if (response.isSuccessful()) {
                        mLastCall = call;
                        mPresenter.onSuccess(response.body().string(), url, tag);
                    } else {
                        mPresenter.onResponseError(new ErrorBean(response.code(), url));
                    }
                }
            }
        };
    }

    public void upLoadFile(final String imgPath, final OnUploadListener listener) {
        File file = new File(imgPath);
        if (!file.exists()) {
            throw new IllegalArgumentException("file path is error,文件不存在...");
        }
        final Message msg = Message.obtain();
        OkHttpUtils.post()
                .addFile("file", "image", file)
                .url(API.UPLOAD_URL)
                .tag(tag)
                .build()
                .connTimeOut(15000)
                .readTimeOut(15000)
                .execute(new StringCallback() {
                    @Override
                    public void onError(Call call, Exception e, int id) {
                        if (listener != null)
                            listener.onUploadFaild("上传失败：" + e.getMessage());
                    }

                    @Override
                    public void onResponse(String response, int id) {
                        if (listener != null) {
                            try {
                                JSONObject jsonObject = new JSONObject(response);
                                if (jsonObject.getInt("status") == 1) {
                                    String url = jsonObject.getString("url");
                                    listener.onUploadFinish(url);
                                } else {
                                    listener.onUploadFaild("上传失败");
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                                listener.onUploadFaild("上传失败：" + e.getMessage());
                            }
                        }
                    }

                    @Override
                    public void onBefore(Request request, int id) {
                        super.onBefore(request, id);
                        Log.w(TAG, "start upload:" + imgPath);
                    }

                    @Override
                    public void onAfter(int id) {
                        super.onAfter(id);
                    }

                    @Override
                    public void inProgress(float progress, long total, int id) {
                        super.inProgress(progress, total, id);
                        if (listener != null)
                            listener.onProgress(progress, total, id);
                    }
                });
    }


    public static interface OnUploadListener {
        void onProgress(float progress, long total, int id);

        void onUploadFinish(String url);

        void onUploadFaild(String e);
    }

    public void cancleAll() {
        Dispatcher dispatcher = mClient.dispatcher();
        synchronized (dispatcher) {
            for (Call call : dispatcher.queuedCalls()) {
                call.cancel();
            }
            for (Call call : dispatcher.runningCalls()) {
                call.cancel();
            }
        }

    }

    public Call getLastCall() {
        return mLastCall;
    }

    public Object getLastRequestBody() {
        return mLastRequestBean;
    }
}
