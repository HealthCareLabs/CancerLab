package com.example.astex.test;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.example.astex.test.Issues.CreateIssueActivity;
import com.google.gson.Gson;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import cz.msebera.android.httpclient.Header;
import models.PatientModel;
import models.PatientRegistrationResult;
import models.Treatments.CreateTreatmentModel;
import models.Treatments.CreateTreatmentResponse;
import network.CancerWebUsage;

/**
 * Created by AsTex on 28.06.2016.
 */

public class CreateTreatmentFragment extends Fragment {
    private TextView mTitle;
    private TextView mBodyField;
    private Button createButton;
    private CreateTreatmentTask mCreateTask;
    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        mTitle = (TextView)view.findViewById(R.id.title);
        mBodyField = (TextView)view.findViewById(R.id.bodyField);
        createButton = (Button)view.findViewById(R.id.button_create);
        createButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    attemptCreate();
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        });
    }
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_create_treatment, container, false);
        return view;
    }

    private void attemptCreate() throws ParseException {
        if (mCreateTask != null) {
            return;
        }

        // Reset errors.
        mTitle.setError(null);
        mBodyField.setError(null);

        String gender = "Man";
        String title = mTitle.getText().toString();
        String bodyField = mTitle.getText().toString();

        boolean cancel = false;
        View focusView = null;

        // Check for a valid password, if the user entered one.
        if (TextUtils.isEmpty(title)) {
            mTitle.setError(getString(R.string.invalid_title_field));
            focusView = mTitle;
            cancel = true;
        }

        if (TextUtils.isEmpty(bodyField)) {
            mBodyField.setError(getString(R.string.invalid_body_field));
            focusView = mBodyField;
            cancel = true;
        }
        if (cancel) {
            // There was an error; don't attempt login and focus the first
            // form field with an error.
            focusView.requestFocus();
        } else {
            // Show a progress spinner, and kick off a background task to
            // perform the user login attempt.
            mCreateTask = new CreateTreatmentFragment.CreateTreatmentTask(title,bodyField);
            mCreateTask.execute();
        }
    }

    public class CreateTreatmentTask extends AsyncTask<String, Void, String> {

        private CreateTreatmentModel createTreatmentModel;

        CreateTreatmentTask(String title, String bodyField) {
            createTreatmentModel = new CreateTreatmentModel();
            createTreatmentModel.title = title;
            createTreatmentModel.bodyField = bodyField;
        }

        @Override
        protected String doInBackground(String... params) {
            try {

                final String[] createResult = {""};
                CancerWebUsage.createTreatment(getContext(), createTreatmentModel, new JsonHttpResponseHandler(){
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                        super.onSuccess(statusCode, headers, response);
                        String objectString  = response.toString();
                        CreateTreatmentResponse result = new Gson().fromJson(objectString, CreateTreatmentResponse.class);
                        if(result.treatmentId!=null){
                            createResult[0] = result.treatmentId;
                        }
                        Log.v("TEST", response.toString());

                    }

                    @Override
                    public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONArray errorResponse) {
                        super.onFailure(statusCode, headers, throwable, errorResponse);

                    }
                });
                return createResult[0];

            } //catch (JSONException e) {
            //  e.printStackTrace();
            // }
            catch (JSONException | UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            return "";
        }

        @Override
        protected void onPostExecute(final String id) {
            mCreateTask = null;
            Log.v("TREATMENT", id);
            if (!id.equals("")) {
                Intent i = new Intent(getContext(), CreateIssueActivity.class);
                i.putExtra("treatmentId", id);
                startActivity(i);
            } else {
                //TODO:SMTH WENT WRONG
            }
        }

        @Override
        protected void onCancelled() {
            mCreateTask = null;
            //showProgress(false);
        }
    }
}
