package com.example.astex.test;

import android.content.Intent;
import android.graphics.Color;
import android.os.AsyncTask;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.AppCompatImageView;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.example.astex.test.Issues.CreateIssueActivity;
import com.example.astex.test.ViewHolders.IssueAdapter;
import com.google.gson.Gson;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Objects;

import cz.msebera.android.httpclient.Header;
import models.Treatments.GetTreatmentsResult;
import models.Treatments.IssueComment;
import models.Treatments.IssueModel;
import models.Treatments.TreatmentIssuesResponse;
import models.Treatments.TreatmentModel;
import network.CancerWebUsage;

public class ViewTreatmentActivity extends AppCompatActivity {

    RecyclerView recyclerView;
    private TreatmentModel treatment;
    private String treatmentId;

    private TextView title;
    private TextView bodyField;
    private TextView created;
    private AppCompatImageView status;
    private Button newIssue;

    private ArrayList<IssueModel> issues = new ArrayList<>();


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_treatment);

        Intent i = getIntent();
        String treatmentJson = i.getStringExtra("treatment");
        treatment = new Gson().fromJson(treatmentJson, TreatmentModel.class);


        recyclerView = (RecyclerView) findViewById(R.id.issuesList);

        newIssue = (Button)findViewById(R.id.button_create);
        newIssue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(getApplicationContext(), CreateIssueActivity.class);
                i.putExtra("treatmentId", treatment._id);
                startActivity(i);
            }
        });

        title = (TextView) findViewById(R.id.title);
        bodyField = (TextView) findViewById(R.id.bodyField);
        created = (TextView) findViewById(R.id.created);
        status = (AppCompatImageView) findViewById(R.id.status);

        title.setText(treatment.title);
        bodyField.setText("Часть тела: " + treatment.bodyField);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dt = new Date();
        try {
            dt = sdf.parse(treatment.created);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
        created.setText("Создано: " + df.format(dt));
        if (Objects.equals(treatment.state, "Answered")) {
            switch (treatment.result) {
                case "Safe":
                    status.setImageResource(R.drawable.ic_verified_user_black_24dp);
                    status.setColorFilter(Color.rgb(0x4C, 0xAF, 0x50));
                    break;
                case "Warning":
                    status.setImageResource(R.drawable.ic_new_releases_black_24dp);
                    status.setColorFilter(Color.rgb(0xFF, 0x98, 0x00));
                    break;
                case "Dangerous":
                    status.setImageResource(R.drawable.ic_new_releases_black_24dp);
                    status.setColorFilter(Color.rgb(0xBF, 0x36, 0x0C));
                    break;
            }

        } else {
            status.setImageResource(R.drawable.ic_timelapse_black_24dp);
            status.setColorFilter(Color.rgb(0x75, 0x75, 0x75));
        }


        LinearLayoutManager llm = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(llm);

        GetIssuesTask task = new GetIssuesTask();
        task.execute();
        updateRecycler();

    }
    private void updateRecycler(){
        IssueAdapter adapter = new IssueAdapter(issues);
        recyclerView.setAdapter(adapter);
    }

    public class GetIssuesTask extends AsyncTask<String, Void, String> {

        GetIssuesTask() {
        }

        @Override
        protected String doInBackground(String... params) {
            try {

                final String[] status = {""};

                CancerWebUsage.getTreatmentIssues(treatment._id, new JsonHttpResponseHandler(){
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                        super.onSuccess(statusCode, headers, response);
                        String objectString  = response.toString();
                        TreatmentIssuesResponse result = new Gson().fromJson(objectString, TreatmentIssuesResponse.class);
                        if(result.status!=null){
                            issues = result.issues;
                        }
                        Log.v("ISSUES", objectString);
                        status[0] = result.status;
                    }

                    @Override
                    public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONArray errorResponse) {
                        super.onFailure(statusCode, headers, throwable, errorResponse);
                        status[0] = "Failed";
                    }
                });
                return status[0];

            } //catch (JSONException e) {
            //  e.printStackTrace();
            // }
            catch (JSONException | UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            return "";
        }

        @Override
        protected void onPostExecute(final String status) {
            Log.v("Issues", status);
            if (!status.equals("OK")) {
                Snackbar.make(findViewById(R.id.content),"Произошла ошибка при загрузке", Snackbar.LENGTH_LONG).show();
            } else{
                updateRecycler();
            }
        }
    }
}

