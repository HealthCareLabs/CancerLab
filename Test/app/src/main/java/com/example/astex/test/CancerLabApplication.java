package com.example.astex.test;

import android.app.Application;
import android.content.Context;
import android.util.DisplayMetrics;

import Facade.AbstractStorageFacade;
import Facade.KeyValueStorageFacade;

/**
 * Created by AsTex on 28.06.2016.
 */

public class CancerLabApplication extends Application {

    private static AbstractStorageFacade facade;
    public void onCreate() {
        super.onCreate();
        facade = new KeyValueStorageFacade(getApplicationContext());
    }

    public static AbstractStorageFacade getFacade(){
      return facade;
    };
}
