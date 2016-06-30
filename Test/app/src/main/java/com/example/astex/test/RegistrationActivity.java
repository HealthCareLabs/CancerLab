package com.example.astex.test;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.TextView;

import com.google.gson.Gson;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.BaseJsonHttpResponseHandler;
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
import network.CancerWebUsage;

public class RegistrationActivity extends AppCompatActivity {

    private Toolbar toolbar;
    private TextView toolbarTitle;

    private TextView nameTextView;
    private TextView lastNameTextView;
    private TextView secondNameTextView;
    private RadioButton genderFemaleRadioButton;
    private RadioButton genderMaleRadioButton;
    private TextView birthdayTextView;
    private TextView policyNumberTextView;
    private TextView locationTextView;
    private TextView phoneNumberTextView;
    private TextView emailTextView;
    private TextView passwordTextView;
    private View registerForm;
    private View progressBar;

    private RegistrationActivity.UserRegisterTask mRegisterTask = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        getSupportActionBar().setDisplayShowTitleEnabled(false);

        toolbarTitle = (TextView) toolbar.findViewById(R.id.toolbar_title);
        toolbarTitle.setText("Регистрация");

        progressBar = (View) findViewById(R.id.register_progress);
        registerForm = (View) findViewById(R.id.registerView);
        nameTextView = (TextView) findViewById(R.id.first_name);
        lastNameTextView = (TextView) findViewById(R.id.last_name);
        secondNameTextView = (TextView) findViewById(R.id.second_name);
        genderFemaleRadioButton = (RadioButton) findViewById(R.id.female);
        genderMaleRadioButton = (RadioButton) findViewById(R.id.male);
        birthdayTextView = (TextView) findViewById(R.id.birthday_date);
        policyNumberTextView = (TextView) findViewById(R.id.policy_number);
        locationTextView = (TextView) findViewById(R.id.location);
        phoneNumberTextView = (TextView) findViewById(R.id.phone_number);
        emailTextView = (TextView) findViewById(R.id.email);
        passwordTextView = (TextView) findViewById(R.id.password);

        Button mEmailSignInButton = (Button) findViewById(R.id.button_registration);
        mEmailSignInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    attemptLogin();
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        });


    }

    private void attemptLogin() throws ParseException {
        if (mRegisterTask != null) {
            return;
        }

        // Reset errors.
        emailTextView.setError(null);
        passwordTextView.setError(null);

        // Store values at the time of the login attempt.
        String email = emailTextView.getText().toString();
        String password = passwordTextView.getText().toString();
        String firstName = nameTextView.getText().toString();
        String lastName = lastNameTextView.getText().toString();
        String secondName = secondNameTextView.getText().toString();
        String birthDate = birthdayTextView.getText().toString();
        String policyNumber = policyNumberTextView.getText().toString();
        String location = locationTextView.getText().toString();
        String phoneNumber = phoneNumberTextView.getText().toString();
        String gender = "Man";

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy");
        Date d = dateFormat.parse(birthDate);
        birthDate = d.toString();
        if (genderFemaleRadioButton.isChecked()) {
            gender = "woman";
        }
        if (genderMaleRadioButton.isChecked())
            gender = "man";


        boolean cancel = false;
        View focusView = null;

        // Check for a valid password, if the user entered one.
        if (TextUtils.isEmpty(password)) {
            passwordTextView.setError(getString(R.string.error_invalid_password));
            focusView = passwordTextView;
            cancel = true;
        }

        // Check for a valid email address.
        if (TextUtils.isEmpty(email)) {
            emailTextView.setError(getString(R.string.error_field_required));
            focusView = emailTextView;
            cancel = true;
        }
        if (cancel) {
            // There was an error; don't attempt login and focus the first
            // form field with an error.
            focusView.requestFocus();
        } else {
            // Show a progress spinner, and kick off a background task to
            // perform the user login attempt.
            showProgress(true);
            mRegisterTask = new UserRegisterTask(firstName, secondName, lastName, birthDate, gender, policyNumber, location, phoneNumber, email, password);
            mRegisterTask.execute();
        }
    }

    public class UserRegisterTask extends AsyncTask<Boolean, Void, Boolean> {

        private PatientModel patientModel;

        UserRegisterTask(String name, String secondName, String lastName, String birthdayDate, String gender, String policyNumber, String location, String phoneNumber, String email, String password) {
            patientModel = new PatientModel(name, secondName, lastName, birthdayDate, gender, policyNumber, location, phoneNumber, email, password);
        }

        @Override
        protected Boolean doInBackground(Boolean... params) {
            try {

                final boolean[] regResult = {false};
                CancerWebUsage.registerAccount(getApplicationContext(), patientModel, new JsonHttpResponseHandler(){
                            @Override
                            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                                super.onSuccess(statusCode, headers, response);
                                String objectString  = response.toString();
                                PatientRegistrationResult result = new Gson().fromJson(objectString, PatientRegistrationResult.class);
                                if(result.apiKey!=null){
                                    regResult[0] = true;
                                    CancerLabApplication.getFacade().putString("X-API-KEY", result.apiKey);
                                    CancerLabApplication.getFacade().putString("_id", result._id);
                                    CancerLabApplication.getFacade().savePatientModel(result);

                                }
                                Log.v("TEST", response.toString());

                            }

                            @Override
                            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONArray errorResponse) {
                                super.onFailure(statusCode, headers, throwable, errorResponse);

                            }
                        });
                return regResult[0];
                //return CancerWebUsage.registerAccount(patientModel);

            } //catch (JSONException e) {
            //  e.printStackTrace();
            // }
            catch (JSONException | UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            return false;
        }

        @Override
        protected void onPostExecute(final Boolean success) {
            mRegisterTask = null;
            showProgress(false);
            Log.v("TEST", success.toString());
            if (success) {
                Intent i = new Intent(getApplicationContext(), MainActivity.class);
                startActivity(i);
            } else {
                // mPasswordView.setError(getString(R.string.error_incorrect_password));
                // mPasswordView.requestFocus();
            }
        }

        @Override
        protected void onCancelled() {
            mRegisterTask = null;
            //showProgress(false);
        }
    }

    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private void showProgress(final boolean show) {
        // On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
        // for very easy animations. If available, use these APIs to fade-in
        // the progress spinner.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
            int shortAnimTime = getResources().getInteger(android.R.integer.config_shortAnimTime);

            registerForm.setVisibility(show ? View.GONE : View.VISIBLE);
            registerForm.animate().setDuration(shortAnimTime).alpha(
                    show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    registerForm.setVisibility(show ? View.GONE : View.VISIBLE);
                }
            });

            progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
            progressBar.animate().setDuration(shortAnimTime).alpha(
                    show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
                }
            });
        } else {
            // The ViewPropertyAnimator APIs are not available, so simply show
            // and hide the relevant UI components.
            progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
            registerForm.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }
}
