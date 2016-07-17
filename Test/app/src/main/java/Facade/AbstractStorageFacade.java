package Facade;

import java.util.List;

import models.PatientModel;
import models.PatientRegistrationResult;
import models.Treatments.TreatmentModel;

/**
 * Created by AsTex on 28.06.2016.
 */

public abstract class AbstractStorageFacade {

    public abstract int getIntByName(String id);
    public abstract String getStringByName(String name);
    public abstract  void putString(String name, String value);
    public abstract  void putInt(String name, int value);
    public abstract PatientRegistrationResult getPatient();
    public abstract void savePatientModel(PatientRegistrationResult registrationResult);
    public abstract boolean hasKey(String key);
}
