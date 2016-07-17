package com.example.astex.test;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import org.w3c.dom.Text;

import models.PatientModel;
import models.PatientRegistrationResult;

/**
 * Created by AsTex on 28.06.2016.
 */

public class ProfileFragment extends Fragment {
    private TextView mEmail;
    private TextView mFullName;
    private TextView mPhone;
    private TextView mLocation;
    private TextView mPolicyNumber;

    public ProfileFragment() {


    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_profile, container, false);

        return view;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        mFullName = (TextView)view.findViewById(R.id.fullName);
        mEmail = (TextView) view.findViewById(R.id.email);
        mPhone = (TextView) view.findViewById(R.id.phone);
        mLocation = (TextView) view.findViewById(R.id.location);
        mPolicyNumber = (TextView) view.findViewById(R.id.policyNumber);
        PatientModel patient = CancerLabApplication.getFacade().getPatient().patient;
        mEmail.setText(patient.email);
        mPolicyNumber.setText(patient.policyNumber);
        mPhone.setText(patient.phone);
        mLocation.setText(patient.location);
        mFullName.setText(patient.lastName + ' ' + patient.firstName + ' ' + patient.secondName);

    }
}
