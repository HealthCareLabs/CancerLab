package network;

import android.content.Context;

import com.example.astex.test.CancerLabApplication;
import com.loopj.android.http.*;

import java.io.UnsupportedEncodingException;

import cz.msebera.android.httpclient.entity.StringEntity;
import cz.msebera.android.httpclient.protocol.HTTP;

/**
 * Created by AsTex on 17.06.2016.
 */

public class CancerWeb {
    public static final String BASE_URL = "http://192.168.1.14:1337/api/";
    private static boolean headerInserted = false;
    private static SyncHttpClient client = new SyncHttpClient();

    public static void get(String url, RequestParams params, JsonHttpResponseHandler responseHandler) {
        insertHeader();
        client.get(getAbsoluteUrl(url), params, responseHandler);
    }

    public static void post(Context context, String url, String json, JsonHttpResponseHandler responseHandler) throws UnsupportedEncodingException {
        insertHeader();
        StringEntity entity = new StringEntity(json, HTTP.UTF_8);
        client.post(context, getAbsoluteUrl(url), entity, "application/json",responseHandler);
    }

    public static void put(Context context, String url, String json, JsonHttpResponseHandler responseHandler) throws UnsupportedEncodingException {
        insertHeader();
        StringEntity entity = new StringEntity(json, HTTP.UTF_8);
        client.put(context, getAbsoluteUrl(url), entity, "application/json",responseHandler);
    }
    public static void uploadFile(String url, RequestParams params, JsonHttpResponseHandler responseHandler){
        insertHeader();
        client.post(getAbsoluteUrl(url),params,responseHandler);
    }

    public static void insertHeader(){
        if(!headerInserted){
            client.addHeader("X-API-KEY", CancerLabApplication.getFacade().getStringByName("X-API-KEY"));
            headerInserted = true;
        }
    }

    private static String getAbsoluteUrl(String relativeUrl) {
        return BASE_URL + relativeUrl;
    }
}
