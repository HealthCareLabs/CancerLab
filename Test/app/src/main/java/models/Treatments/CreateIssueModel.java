package models.Treatments;

import java.security.InvalidParameterException;
import java.util.List;

/**
 * Created by AsTex on 29.06.2016.
 */

public class CreateIssueModel {
    public String size;
    public String colorModification;
    public String surface;
    public String bleeding;
    public String lymphEnlarging;
    public String patientComment;
    public List<String> images;

    public void setColorModification(String value) throws InvalidParameterException{
        switch (value){
            case "Светлее": colorModification = "Brighter"; break;
            case "Темнее": colorModification = "Darker"; break;
            case "Без изменений": colorModification = "No changes"; break;
            default: throw new InvalidParameterException();
        }
    }

    public void setBleeding(String value)throws InvalidParameterException {
        switch (value){
            case "Нет": bleeding = "No"; break;
            case "Есть": bleeding = "Yes"; break;
            default: throw new InvalidParameterException();
        }
    }
    public void setLymphEnlarging(String value) throws InvalidParameterException{
        switch (value){
            case "Да": lymphEnlarging = "No"; break;
            case "Нет": lymphEnlarging = "Yes"; break;
            default: throw new InvalidParameterException();
        }
    }
}
