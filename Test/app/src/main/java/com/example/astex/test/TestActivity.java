package com.example.astex.test;

import android.app.Activity;
import android.os.Bundle;
import android.support.v7.widget.CardView;
import android.view.View;
import android.widget.TextView;

import com.github.aakira.expandablelayout.ExpandableRelativeLayout;

public class TestActivity extends Activity {
    private ExpandableRelativeLayout mExpandableLayout;
    private TextView textView;
    private CardView cardView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_treatment);

        //cardView = (CardView)findViewById(R.id.card);
        //LinearLayout.LayoutParams params = (LinearLayout.LayoutParams)cardView.getLayoutParams();
        //params.height = 200;
        //cardView.setLayoutParams(params);

        mExpandableLayout = (ExpandableRelativeLayout)findViewById(R.id.expandableLayout);
        //mExpandableLayout.initLayout(true);
        textView = (TextView)findViewById(R.id.header);
        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mExpandableLayout.toggle();
            }
        });


    }
}
