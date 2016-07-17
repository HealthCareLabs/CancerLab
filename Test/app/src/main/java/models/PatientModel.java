package models;

/**
 * Created by AsTex on 28.06.2016.
 */

public class PatientModel {
    public String firstName;
    public String lastName;
    public String secondName;
    public String email;
    public String password;
    public String phone;
    public String location;
    public String gender;
    public String birthDate;
    public String policyNumber;
    public String apiKey;

    public PatientModel(String firstName,
                        String secondName,
                        String lastName,
                        String birthDate,
                        String gender,
                        String policyNumber,
                        String location,
                        String phone,
                        String email,
                        String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.secondName = secondName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.location = location;
        this.gender = gender;
        this.birthDate = birthDate;
        this.policyNumber = policyNumber;
    }

}

