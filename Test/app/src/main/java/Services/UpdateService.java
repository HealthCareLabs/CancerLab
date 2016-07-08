package Services;

import android.app.IntentService;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.util.Log;

import com.example.astex.test.MainActivity;
import com.example.astex.test.R;
import com.google.gson.Gson;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import cz.msebera.android.httpclient.Header;
import models.Treatments.GetTreatmentsResult;
import models.Treatments.TreatmentModel;
import network.CancerWebUsage;

/**
 * Created by AsTex on 07.07.2016.
 */

public class UpdateService extends Service {
    private final IBinder binder = new UpdateBinder();
    private List<String> treatmentsEtags = new ArrayList<>();

    /**
     * Creates an IntentService.  Invoked by your subclass's constructor.
     */
    public UpdateService() {
        super();
    }

    public void doUpdate() throws InterruptedException {
        while (true) {
            task.execute();
            Thread.sleep(60000);
        }
    }

    AsyncTask<Void, Void, Void> task = new AsyncTask<Void, Void, Void>() {

        @Override
        protected Void doInBackground(Void... params) {
            try {
                CancerWebUsage.getTreatments(new JsonHttpResponseHandler() {
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                        super.onSuccess(statusCode, headers, response);
                        String objectString = response.toString();
                        GetTreatmentsResult result = new Gson().fromJson(objectString, GetTreatmentsResult.class);
                        if (result.status != null) {
                            if (treatmentsEtags.size() > 0) {
                                for (TreatmentModel tr : result.treatments) {

                                    if (!treatmentsEtags.contains(tr.ETag)) {
                                        NotificationCompat.Builder mBuilder =
                                                new NotificationCompat.Builder(getApplicationContext())
                                                        .setContentTitle("Изменен статус у сообщения!")
                                                        .setContentText("CancerLab Notification!");
                                        Intent resultIntent = new Intent(getApplicationContext(), MainActivity.class);
                                        TaskStackBuilder stackBuilder = TaskStackBuilder.create(getApplicationContext());
                                        stackBuilder.addParentStack(MainActivity.class);
                                        stackBuilder.addNextIntent(resultIntent);
                                        PendingIntent resultPendingIntent =
                                                stackBuilder.getPendingIntent(
                                                        0,
                                                        PendingIntent.FLAG_UPDATE_CURRENT
                                                );
                                        mBuilder.setContentIntent(resultPendingIntent);
                                        NotificationManager mNotificationManager =
                                                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
// mId allows you to update the notification later on.
                                        mNotificationManager.notify(2828266, mBuilder.build());
                                    }
                                }
                            } else {
                                treatmentsEtags = new ArrayList<String>();
                                for (TreatmentModel tr : result.treatments) {
                                    treatmentsEtags.add(tr.ETag);
                                }
                            }
                        }
                    }

                    @Override
                    public void onFailure(int statusCode, Header[] headers, Throwable
                            throwable, JSONArray errorResponse) {
                        super.onFailure(statusCode, headers, throwable, errorResponse);
                    }
                });
            } catch (
                    JSONException e
                    )

            {
                e.printStackTrace();
            } catch (
                    UnsupportedEncodingException e
                    )

            {
                e.printStackTrace();
            }

            return null;
        }
    };


    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    public class UpdateBinder extends Binder {
        public UpdateService getService() {
            return UpdateService.this;
        }
    }
}
