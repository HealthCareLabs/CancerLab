package com.example.astex.test;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.design.widget.Snackbar;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.example.astex.test.Issues.CreateIssueActivity;
import com.example.astex.test.ViewHolders.TreatmentAdapter;
import com.google.gson.Gson;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import cz.msebera.android.httpclient.Header;
import models.Treatments.CreateTreatmentModel;
import models.Treatments.CreateTreatmentResponse;
import models.Treatments.GetTreatmentsResult;
import models.Treatments.TreatmentModel;
import network.CancerWebUsage;

/**
 * Created by AsTex on 08.06.2016.
 */

public class HistoryFragment extends Fragment {

    private RecyclerView mRecycleTreatments;
    private SwipeRefreshLayout mSwipeLayout;
    private ArrayList<TreatmentModel> treatmentList = new ArrayList<TreatmentModel>();

    private GetTreatmentsTask mTreatmentsTask;

    public HistoryFragment(){

    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_history,container,false);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        mRecycleTreatments = (RecyclerView)view.findViewById(R.id.treatmentsView);
        mSwipeLayout = (SwipeRefreshLayout)view.findViewById(R.id.swipeRefreshLayout);
        mSwipeLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                updateTreatments();
            }
        });
        LinearLayoutManager llm = new LinearLayoutManager(view.getContext());
        mRecycleTreatments.setLayoutManager(llm);
        updateTreatments();
    }

    private void updateTreatments(){
        mTreatmentsTask = new GetTreatmentsTask();
        mTreatmentsTask.execute();
        onItemsLoadComplete();
    }
    void onItemsLoadComplete() {
        TreatmentAdapter adapter = new TreatmentAdapter(treatmentList);
        mRecycleTreatments.setAdapter(adapter);
        mSwipeLayout.setRefreshing(false);
    }

    public class GetTreatmentsTask extends AsyncTask<String, Void, String> {

        GetTreatmentsTask() {
        }

        @Override
        protected String doInBackground(String... params) {
            try {

                final String[] status = {""};

                CancerWebUsage.getTreatments(new JsonHttpResponseHandler(){
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                        super.onSuccess(statusCode, headers, response);
                        String objectString  = response.toString();
                        GetTreatmentsResult result = new Gson().fromJson(objectString, GetTreatmentsResult.class);
                        if(result.status!=null){
                            treatmentList = result.treatments;
                        }
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
            mTreatmentsTask = null;
            Log.v("TREATMENTS_STATUS", status);
            if (!status.equals("OK")) {
                Snackbar.make(getView(),"Произошла ошибка при обновлении", Snackbar.LENGTH_LONG).show();
            }
        }

        @Override
        protected void onCancelled() {
            mTreatmentsTask = null;
            //showProgress(false);
        }
    }
}
