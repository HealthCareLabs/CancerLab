package com.example.astex.test.ViewHolders;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.AsyncTask;
import android.support.v7.widget.AppCompatImageView;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.astex.test.R;
import com.example.astex.test.ViewTreatmentActivity;
import com.github.aakira.expandablelayout.ExpandableRelativeLayout;
import com.google.gson.Gson;

import java.io.InputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Objects;

import de.hdodenhof.circleimageview.CircleImageView;
import models.Treatments.IssueModel;
import models.Treatments.TreatmentModel;
import network.CancerWeb;

/**
 * Created by AsTex on 29.06.2016.
 */

public class TreatmentAdapter extends RecyclerView.Adapter<TreatmentAdapter.TreatmentViewHolder> {
    private ArrayList<TreatmentModel> treatments;

    public static class TreatmentViewHolder extends RecyclerView.ViewHolder {
        TextView title;
        TextView bodyField;
        TextView created;
        AppCompatImageView status;
        CircleImageView lastImage;
        Button more;

        TreatmentViewHolder(View itemView) {
            super(itemView);
            title = (TextView) itemView.findViewById(R.id.title);
            bodyField = (TextView) itemView.findViewById(R.id.bodyField);
            created = (TextView) itemView.findViewById(R.id.created);
            status = (AppCompatImageView) itemView.findViewById(R.id.status);
            lastImage = (CircleImageView) itemView.findViewById(R.id.lastImage);
            more = (Button) itemView.findViewById(R.id.more);

        }
    }

    public TreatmentAdapter(ArrayList<TreatmentModel> treatments) {
        this.treatments = treatments;
    }

    @Override
    public TreatmentViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_treatment, parent, false);
        TreatmentViewHolder ivh = new TreatmentViewHolder(v);
        return ivh;
    }

    @Override
    public void onBindViewHolder(final TreatmentViewHolder holder, int position) {
        holder.setIsRecyclable(false);

        final TreatmentModel treatment = treatments.get(position);
        holder.title.setText(treatment.title);
        holder.bodyField.setText("Часть тела: " + treatment.bodyField);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dt = new Date();
        try {
            dt = sdf.parse(treatment.created);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
        holder.created.setText("Создано: " + df.format(dt));
        if (Objects.equals(treatment.state, "Answered")) {
            switch (treatment.result) {
                case "Safe":
                    holder.status.setImageResource(R.drawable.ic_verified_user_black_24dp);
                    holder.status.setColorFilter(Color.rgb(0x4C, 0xAF, 0x50));
                    break;
                case "Warning":
                    holder.status.setImageResource(R.drawable.ic_new_releases_black_24dp);
                    holder.status.setColorFilter(Color.rgb(0xFF, 0x98, 0x00));
                    break;
                case "Dangerous":
                    holder.status.setImageResource(R.drawable.ic_new_releases_black_24dp);
                    holder.status.setColorFilter(Color.rgb(0xBF, 0x36, 0x0C));
                    break;
            }

        } else{
            holder.status.setImageResource(R.drawable.ic_timelapse_black_24dp);
            holder.status.setColorFilter(Color.rgb(0x75, 0x75, 0x75));
        }

        holder.more.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(v.getContext(), ViewTreatmentActivity.class);
                i.putExtra("treatment", new Gson().toJson(treatment));
                v.getContext().startActivity(i);
            }
        });

        DownloadImageTask dit = new DownloadImageTask(holder.lastImage);
        dit.execute(CancerWeb.BASE_URL+"treatments/"+treatment._id+"/lastImage");
    }

    @Override
    public void onAttachedToRecyclerView(RecyclerView recyclerView) {
        super.onAttachedToRecyclerView(recyclerView);
    }

    @Override
    public int getItemCount() {
        return treatments.size();
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        CircleImageView bmImage;

        public DownloadImageTask(CircleImageView bmImage) {
            this.bmImage = bmImage;
        }

        protected Bitmap doInBackground(String... urls) {
            String urldisplay = urls[0];
            Bitmap mIcon11 = null;
            try {
                InputStream in = new java.net.URL(urldisplay).openStream();
                mIcon11 = BitmapFactory.decodeStream(in);
            } catch (Exception e) {
                Log.e("Error", e.getMessage());
                e.printStackTrace();
            }
            return mIcon11;
        }

        protected void onPostExecute(Bitmap result) {
            bmImage.setImageBitmap(result);
        }
    }
}
