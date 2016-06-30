package com.example.astex.test.ViewHolders;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v7.widget.AppCompatImageView;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.astex.test.R;
import com.github.aakira.expandablelayout.ExpandableRelativeLayout;

import java.io.InputStream;
import java.lang.reflect.Array;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import de.hdodenhof.circleimageview.CircleImageView;
import models.Treatments.IssueModel;
import network.CancerWeb;

/**
 * Created by AsTex on 29.06.2016.
 */

public class IssueAdapter extends RecyclerView.Adapter<IssueAdapter.IssueViewHolder> {
    private ArrayList<IssueModel> issues = new ArrayList<>();
    public static class IssueViewHolder extends RecyclerView.ViewHolder {
        TextView header;
        ExpandableRelativeLayout expandableRelativeLayout;
        TextView size;
        TextView colorModification;
        TextView surface;
        TextView bleeding;
        TextView lymph;
        TextView patientComment;
        TextView answerDate;
        TextView answerContent;
        TextView drAnswer;
        LinearLayout imageWrapper;
        View splitter;

        IssueViewHolder(View itemView) {
            super(itemView);
            header =(TextView)itemView.findViewById(R.id.header);
            //expandableRelativeLayout = (ExpandableRelativeLayout)itemView.findViewById(R.id.expandableLayout);
            size =(TextView)itemView.findViewById(R.id.size);
            colorModification =(TextView)itemView.findViewById(R.id.colorModification);
            surface =(TextView)itemView.findViewById(R.id.surface);
            bleeding =(TextView)itemView.findViewById(R.id.bleeding);
            lymph =(TextView)itemView.findViewById(R.id.lymph);
            patientComment =(TextView)itemView.findViewById(R.id.patientComment);
            answerDate =(TextView)itemView.findViewById(R.id.answerDate);
            answerContent =(TextView)itemView.findViewById(R.id.answerContent);
            drAnswer =(TextView)itemView.findViewById(R.id.drAnswer);
            imageWrapper =(LinearLayout) itemView.findViewById(R.id.image_wrapper);
            splitter = itemView.findViewById(R.id.splitter);
        }
    }
    public IssueAdapter(ArrayList<IssueModel> issues){
        this.issues = issues;
    }
    @Override
    public IssueViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_issue_view, parent, false);
        IssueViewHolder ivh = new IssueViewHolder(v);
        return ivh;
    }

    @Override
    public void onBindViewHolder(final IssueViewHolder holder, int position) {
        holder.setIsRecyclable(false);
//        holder.expandableRelativeLayout.initLayout(false);
        // expandableRelativeLayout.collapse();
        /*holder.header.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               holder.expandableRelativeLayout.toggle();
            }
        });
        */
        IssueModel issue = issues.get(position);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dt = new Date();
        try {
            dt = sdf.parse(issue.created);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
        holder.header.setText("Обращение от " + df.format(dt));

        holder.size.setText("Размер: "+issue.size);
        String colorMod = "";
        //holder.expandableRelativeLayout.setExpanded(false);
        switch (issue.colorModification){
            case "Darker": colorMod ="темнее";break;
            case "Brighter": colorMod ="светлее";break;
            case "No changes": colorMod ="без изменений";break;
        }
        holder.colorModification.setText("Изменения в цвете: "+colorMod);
        holder.surface.setText("Изменения в цвете: "+issue.surface);
        String bleeding = "";
        switch (issue.bleeding){
            case "Yes": bleeding = "да";
            case "No": bleeding = "нет";
        }
        holder.surface.setText("Наличие кровотечения: "+bleeding);

        String lymph = "";
        switch (issue.lymphEnlarging){
            case "Yes": lymph = "да";
            case "No": lymph = "нет";
        }
        holder.lymph.setText("Увеличенные лимфоузлы: " + lymph);

        holder.patientComment.setText("Комментарий: " + issue.patientComment);

        if(issue.comment!=null){
            holder.answerDate.setText("Дата ответа: " + issue.comment.created);
            holder.answerContent.setText(issue.comment.comment);
        } else{
            holder.answerDate.setVisibility(View.GONE);
            holder.answerContent.setVisibility(View.GONE);
            holder.drAnswer.setVisibility(View.GONE);
            holder.splitter.setVisibility(View.GONE);
        }

        for(int i=0;i<issue.images.size();i++){
            AppCompatImageView iv = new AppCompatImageView(holder.imageWrapper.getContext());
            holder.imageWrapper.addView(iv);
            LinearLayout.LayoutParams llParams = new LinearLayout.LayoutParams(260,260);
            llParams.setMargins(30,30,30,30);
            iv.setLayoutParams(llParams);
            DownloadImageTask dit = new DownloadImageTask(iv);
            dit.execute(CancerWeb.BASE_URL + "images/"+issue.images.get(i));

        }
    }
    @Override
    public void onAttachedToRecyclerView(RecyclerView recyclerView) {
        super.onAttachedToRecyclerView(recyclerView);
    }
    @Override
    public int getItemCount() {
        return issues.size();
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        AppCompatImageView bmImage;

        public DownloadImageTask(AppCompatImageView bmImage) {
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
