package network;

import android.content.Context;

import com.google.gson.Gson;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.json.JSONException;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.UnsupportedEncodingException;

import cz.msebera.android.httpclient.Header;
import models.PatientModel;
import models.Treatments.CreateIssueModel;
import models.Treatments.CreateTreatmentModel;

/**
 * Created by AsTex on 17.06.2016.
 */

public class CancerWebUsage {
    public static boolean registerAccount(Context context, PatientModel patientModel, JsonHttpResponseHandler responseHandler) throws JSONException, UnsupportedEncodingException {
        String patientJSON = new Gson().toJson(patientModel);
        CancerWeb.post(context, "patients/", patientJSON, responseHandler);
        return true;
    }

    public static boolean createTreatment(Context context, CreateTreatmentModel model, JsonHttpResponseHandler responseHandler) throws  JSONException, UnsupportedEncodingException{
        String patientJSON = new Gson().toJson(model);
        CancerWeb.post(context, "treatments/", patientJSON, responseHandler);
        return true;
    }
    public static boolean getTreatments(JsonHttpResponseHandler responseHandler) throws  JSONException, UnsupportedEncodingException{
        CancerWeb.get("treatments/", new RequestParams(), responseHandler);
        return true;
    }

    public static boolean getTreatmentIssues(String treatmentId, JsonHttpResponseHandler responseHandler) throws  JSONException, UnsupportedEncodingException{
        CancerWeb.get("treatments/"+treatmentId+"/issues", new RequestParams(), responseHandler);
        return true;
    }
    public static boolean createIssue(String treatmentId,Context context, CreateIssueModel model, JsonHttpResponseHandler responseHandler) throws JSONException, UnsupportedEncodingException{
        String patientJSON = new Gson().toJson(model);
        CancerWeb.post(context, "treatments/"+treatmentId+"/issues/", patientJSON, responseHandler);
        return true;
    }

    public static boolean uploadImage(File file, JsonHttpResponseHandler responseHandler) throws FileNotFoundException {
        RequestParams params = new RequestParams();
        params.put("upl", file);
        CancerWeb.uploadFile("images/",params, responseHandler);
        return true;
    }
}
