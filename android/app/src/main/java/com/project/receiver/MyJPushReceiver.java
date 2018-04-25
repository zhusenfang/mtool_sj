package com.project.receiver;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.NotificationCompat;
import android.text.TextUtils;

import com.project.R;
import com.project.bean.PushExtraBean;
import com.project.util.Json_U;

import cn.jpush.android.api.JPushInterface;

/**
 * Created by sshss on 2018/1/9.
 */

public class MyJPushReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent data) {
        if (JPushInterface.ACTION_MESSAGE_RECEIVED.equals(data.getAction())) {
            Bundle extras = data.getExtras();
            String message = data.getStringExtra(JPushInterface.EXTRA_MESSAGE);
            String extra = data.getStringExtra(JPushInterface.EXTRA_EXTRA);
            String title = data.getStringExtra(JPushInterface.EXTRA_TITLE);
//            System.out.println("MyJPushReceiver  extra:"+extra);
            if (!TextUtils.isEmpty(extra)) {
                PushExtraBean pushExtraBean = Json_U.fromJson(extra, PushExtraBean.class);
                int orderType = pushExtraBean.orderType;
                NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                NotificationCompat.Builder builder = new NotificationCompat.Builder(context);

                builder.setContentTitle(title)
                        .setSmallIcon(R.mipmap.ic_logo)
                        .setTicker(title)
                        .setContentText(message)
                        .setPriority(NotificationCompat.PRIORITY_HIGH)
                        .setAutoCancel(true);
                int soundRes = -1;
                if (orderType == 0)
                    soundRes = R.raw.waisong;
                else if (orderType == 1)
                    soundRes = R.raw.daodian;
                if (soundRes != -1) {
                    Uri parse = Uri.parse("android.resource://" + context.getPackageName() + "/" + R.raw.daodian);
                    builder.setSound(parse, android.media.AudioManager.ADJUST_LOWER)
                            .setDefaults(Notification.DEFAULT_LIGHTS);
                }
                Intent intent = new Intent();
                intent.setAction("cn.jpush.android.intent.NOTIFICATION_OPENED");
                intent.putExtra(JPushInterface.EXTRA_NOTIFICATION_ID, extras.getInt(JPushInterface.EXTRA_NOTIFICATION_ID));
                intent.putExtra(JPushInterface.EXTRA_MESSAGE, extras.getString(JPushInterface.EXTRA_MESSAGE));
                intent.putExtra(JPushInterface.EXTRA_EXTRA, extra);
                PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 99, intent, PendingIntent.FLAG_UPDATE_CURRENT);
                builder.setContentIntent(pendingIntent);
                Notification build = builder.build();
                notificationManager.notify(0, build);
            }
        }
    }
}
