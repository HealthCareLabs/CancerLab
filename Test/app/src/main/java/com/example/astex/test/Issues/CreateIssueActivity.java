package com.example.astex.test.Issues;

import android.Manifest;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Environment;
import android.os.Parcelable;
import android.provider.MediaStore;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.AppCompatImageView;
import android.support.v7.widget.AppCompatSpinner;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;

import com.example.astex.test.MainActivity;
import com.example.astex.test.R;
import com.example.astex.test.RegistrationActivity;
import com.github.aakira.expandablelayout.Utils;
import com.google.gson.Gson;
import com.loopj.android.http.JsonHttpResponseHandler;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import cz.msebera.android.httpclient.Header;
import id.zelory.compressor.Compressor;
import models.Treatments.CreateIssueModel;
import models.Treatments.CreateIssueResponse;
import models.Treatments.CreateTreatmentModel;
import models.Treatments.CreateTreatmentResponse;
import models.Treatments.UploadImageResult;
import network.CancerWebUsage;

public class CreateIssueActivity extends AppCompatActivity {

    private static final int REQUEST_EXTERNAL_STORAGE = 2;
    private static String[] PERMISSIONS_STORAGE = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };

    private static final int SELECT_PICTURE = 1;

    private LinearLayout mountPoint;
    private AppCompatImageView mAddPhoto;

    private TextView mComment;
    private TextView mSize;
    private AppCompatSpinner mBleeding;
    private AppCompatSpinner mLymph;
    private AppCompatSpinner mSurface;
    private AppCompatSpinner mColorModification;
    private String treatmentId;
    private Button mButton;

    private ArrayList<String> images = new ArrayList<>();


    private CreateIssueTask mIssueTask;
    private UploadImageTask mUploadTask;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_issue);
        verifyStoragePermissions(this);
        treatmentId = getIntent().getStringExtra("treatmentId");

        mountPoint = (LinearLayout) findViewById(R.id.image_mount_point);
        mAddPhoto = (AppCompatImageView) findViewById(R.id.add_image);
        mAddPhoto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openImageIntent();

            }
        });


        mSize = (TextView) findViewById(R.id.size);
        mComment = (TextView) findViewById(R.id.patientComment);

        mBleeding = (AppCompatSpinner) findViewById(R.id.bleeding);
        ArrayAdapter<CharSequence> bleedingAdapter = ArrayAdapter.createFromResource(this, R.array.bleeding, android.R.layout.simple_spinner_item);
        bleedingAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mBleeding.setAdapter(bleedingAdapter);


        mLymph = (AppCompatSpinner) findViewById(R.id.lymph);
        ArrayAdapter<CharSequence> lymphAdapter = ArrayAdapter.createFromResource(this, R.array.lymph, android.R.layout.simple_spinner_item);
        lymphAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mLymph.setAdapter(lymphAdapter);

        mSurface = (AppCompatSpinner) findViewById(R.id.surface);
        ArrayAdapter<CharSequence> surfaceAdapter = ArrayAdapter.createFromResource(this, R.array.surface, android.R.layout.simple_spinner_item);
        surfaceAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mSurface.setAdapter(surfaceAdapter);

        mColorModification = (AppCompatSpinner) findViewById(R.id.colorModification);
        ArrayAdapter<CharSequence> colorModificationAdapter = ArrayAdapter.createFromResource(this, R.array.colorModification, android.R.layout.simple_spinner_item);
        colorModificationAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mColorModification.setAdapter(colorModificationAdapter);

        mButton = (Button) findViewById(R.id.button_create);
        mButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                attemptCreateIssue();
            }
        });


    }

    private Uri outputFileUri;

    private void openImageIntent() {

// Determine Uri of camera image to save.
        final File root = new File(Environment.getExternalStorageDirectory() + File.separator + "MyDir" + File.separator);
        root.mkdirs();
        final String fname = System.currentTimeMillis() + ".jpg";
        final File sdImageMainDirectory = new File(root, fname);
        outputFileUri = Uri.fromFile(sdImageMainDirectory);

        // Camera.
        final List<Intent> cameraIntents = new ArrayList<Intent>();
        final Intent captureIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        final PackageManager packageManager = getPackageManager();
        final List<ResolveInfo> listCam = packageManager.queryIntentActivities(captureIntent, 0);
        for (ResolveInfo res : listCam) {
            final String packageName = res.activityInfo.packageName;
            final Intent intent = new Intent(captureIntent);
            intent.setComponent(new ComponentName(res.activityInfo.packageName, res.activityInfo.name));
            intent.setPackage(packageName);
            intent.putExtra(MediaStore.EXTRA_OUTPUT, outputFileUri);
            cameraIntents.add(intent);
        }

        // Filesystem.
        final Intent galleryIntent = new Intent();
        galleryIntent.setType("image/*");
        galleryIntent.setAction(Intent.ACTION_GET_CONTENT);

        // Chooser of filesystem options.
        final Intent chooserIntent = Intent.createChooser(galleryIntent, "Select Source");

        // Add the camera options.
        chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, cameraIntents.toArray(new Parcelable[cameraIntents.size()]));

        startActivityForResult(chooserIntent, SELECT_PICTURE);
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == RESULT_OK) {
            if (requestCode == SELECT_PICTURE) {
                final boolean isCamera;
                if (data == null) {
                    isCamera = true;
                } else {
                    final String action = data.getAction();
                    if (action == null) {
                        isCamera = false;
                    } else {
                        isCamera = action.equals(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                    }
                }

                Uri selectedImageUri;
                Bitmap result = null;
                if (isCamera) {
                    selectedImageUri = outputFileUri;
                    try {
                        result = getBitmapFromUri(selectedImageUri);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else {
                    selectedImageUri = data == null ? null : data.getData();
                    try {
                        result = getBitmapFromUri(selectedImageUri);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                if (result != null) {
                    ImageView iv = new ImageView(this);
                    iv.setImageBitmap(result);
                    mountPoint.addView(iv);
                    ViewGroup.LayoutParams params = iv.getLayoutParams();
                    params.height = 260;
                    params.width = 260;
                    iv.setLayoutParams(params);
                }
            }
        }
    }

    public Bitmap getBitmapFromUri(Uri contentUri) throws IOException {
        InputStream is = getContentResolver().openInputStream(contentUri);
        File file = new File(this.getFilesDir(), System.currentTimeMillis() + ".jpeg");
        copyInputStreamToFile(is, file);
        Bitmap bitmap = Compressor.getDefault(this).compressToBitmap(file);
        String filePath = saveBitmapToFile(bitmap);
        File compressedFile = new File(filePath);
        UploadImageTask task = new UploadImageTask(compressedFile);
        task.execute();
        return bitmap;
    }

    private String saveBitmapToFile(Bitmap bmp) {
        String filename = this.getFilesDir() + "/" + System.currentTimeMillis() + ".png";
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(filename);
            bmp.compress(Bitmap.CompressFormat.PNG, 100, out); // bmp is your Bitmap instance
            // PNG is a lossless format, the compression factor (100) is ignored
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return filename;
    }

    private void copyInputStreamToFile(InputStream in, File file) {
        try {
            OutputStream out = new FileOutputStream(file);
            byte[] buf = new byte[1024];
            int len;
            while ((len = in.read(buf)) > 0) {
                out.write(buf, 0, len);
            }
            out.close();
            in.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void attemptCreateIssue() {

        String size = mSize.getText().toString();
        String patientComment = mComment.getText().toString();
        String bleeding = mBleeding.getSelectedItem().toString();
        String surface = mSurface.getSelectedItem().toString();
        String lymph = mLymph.getSelectedItem().toString();
        String colorModification = mColorModification.getSelectedItem().toString();

        mIssueTask = new CreateIssueTask(size, bleeding, surface, lymph, colorModification, patientComment, treatmentId);
        mIssueTask.execute();
    }

    public class CreateIssueTask extends AsyncTask<String, Void, String> {

        private CreateIssueModel createIssueModel;
        private String treatment;

        CreateIssueTask(String size, String bleeding, String surface, String lymph, String colorModification, String comment, String treatmentId) {
            treatment = treatmentId;
            createIssueModel = new CreateIssueModel();
            createIssueModel.size = size;
            createIssueModel.setBleeding(bleeding);
            createIssueModel.setColorModification(colorModification);
            createIssueModel.setLymphEnlarging(lymph);
            createIssueModel.patientComment = comment;
            createIssueModel.surface = surface;
            createIssueModel.images = images;
        }

        @Override
        protected String doInBackground(String... params) {
            try {

                final String[] createResult = {""};
                CancerWebUsage.createIssue(treatment, getApplicationContext(), createIssueModel, new JsonHttpResponseHandler() {
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                        super.onSuccess(statusCode, headers, response);
                        String objectString = response.toString();
                        CreateIssueResponse result = new Gson().fromJson(objectString, CreateIssueResponse.class);
                        if (result.issue != null) {
                            createResult[0] = result.issue._id;
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
            mIssueTask = null;
            Log.v("TREATMENT", id);
            if (!id.equals("")) {
                Intent i = new Intent(getApplicationContext(), MainActivity.class);
                startActivity(i);
            } else {

            }
        }

        @Override
        protected void onCancelled() {
            mIssueTask = null;
            //showProgress(false);
        }
    }

    public class UploadImageTask extends AsyncTask<String, Void, String> {

        private File file;

        UploadImageTask(File file) {
            this.file = file;
        }

        @Override
        protected String doInBackground(String... params) {
            try {

                final String[] uploadResult = {""};
                CancerWebUsage.uploadImage(file, new JsonHttpResponseHandler() {
                    @Override
                    public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                        super.onSuccess(statusCode, headers, response);
                        UploadImageResult result = new Gson().fromJson(response.toString(), UploadImageResult.class);
                        if (result.imageId != null) {
                            images.add(result.imageId);
                            Log.v("IMAGE", result.imageId);
                            uploadResult[0] = result.imageId;
                        }
                        Log.v("TEST", response.toString());
                    }

                    @Override
                    public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONArray errorResponse) {
                        super.onFailure(statusCode, headers, throwable, errorResponse);

                    }
                });
                return uploadResult[0];

            } //catch (JSONException e) {
            //  e.printStackTrace();
            // }
            catch (FileNotFoundException e) {
                e.printStackTrace();
            }
            return "";
        }
        @Override
        protected void onPostExecute(final String id) {
            mUploadTask = null;
        }
    }

    /**
     * Checks if the app has permission to write to device storage
     *
     * If the app does not has permission then the user will be prompted to grant permissions
     *
     * @param activity
     */
    public static void verifyStoragePermissions(Activity activity) {
        // Check if we have write permission
        int permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.WRITE_EXTERNAL_STORAGE);

        if (permission != PackageManager.PERMISSION_GRANTED) {
            // We don't have permission so prompt the user
            ActivityCompat.requestPermissions(
                    activity,
                    PERMISSIONS_STORAGE,
                    REQUEST_EXTERNAL_STORAGE
            );
        }
    }
}
