package models.Treatments;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by AsTex on 29.06.2016.
 */

public class IssueModel {
    public String _id;
    public String size;
    public String colorModification;
    public String surface;
    public String bleeding;
    public String lymphEnlarging;
    public String patientComment;
    public ArrayList<String> images;
    public IssueComment comment;

    public String created;
}
