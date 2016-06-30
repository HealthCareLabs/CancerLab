package Facade;

import android.content.Context;
import android.content.SharedPreferences;

import com.google.gson.Gson;

import models.PatientRegistrationResult;


public class KeyValueStorageFacade extends  AbstractStorageFacade {
    private static SharedPreferences sharedPreferences;
    public KeyValueStorageFacade(Context applicationContext){
        sharedPreferences = applicationContext.getSharedPreferences("APP_STORAGE", Context.MODE_PRIVATE);
    }

    @Override
    public int getIntByName(String id) {
        return sharedPreferences.getInt(id,0);
    }

    @Override
    public String getStringByName(String name) {
        return sharedPreferences.getString(name, "");
    }

    @Override
    public void putString(String name, String value) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(name,value);
        editor.apply();
    }

    @Override
    public void putInt(String name, int value) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt(name,value);
        editor.apply();
    }

    @Override
    public PatientRegistrationResult getPatient() {
        String patient = getStringByName("PATIENT");
        if(patient!=null){
            return new Gson().fromJson(patient,PatientRegistrationResult.class);
        }
        return new PatientRegistrationResult();
    }

    @Override
    public void savePatientModel(PatientRegistrationResult registrationResult) {
            String regString = new Gson().toJson(registrationResult);
            putString("PATIENT", regString);
    }

    @Override
    public boolean hasKey(String key) {
        return sharedPreferences.contains(key);
    }


}
