package com.splitmadi;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;
import com.splitmadi.MyContactsPackage;
import com.splitmadi.PhotoPickerPackage;

import android.content.SharedPreferences;
import android.content.Context;
import android.app.Activity;
import android.media.RingtoneManager;
// import com.facebook.react.ReactApplication;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyContactsModule());
          packages.add(new MyContactsPackage());
          packages.add(new PhotoPickerPackage());
          // packages.add(new MyContactsModule(this.reactNativeHost.getReactInstanceManager().getCurrentReactContext()));
          
          
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  String generateUniqueChannelName(String baseName) {
      // Append a unique identifier (e.g., timestamp or random string)
      String uniqueIdentifier = String.valueOf(System.currentTimeMillis());
      return baseName + "_" + uniqueIdentifier;
  }
  private static final String PREFS_NAME = "MyPrefsFile";
    private static final String FIRST_RUN_KEY = "firstRun";
  private boolean isFirstRun() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        return prefs.getBoolean(FIRST_RUN_KEY, true);
    }

    private void setFirstRunFlag(boolean value) {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putBoolean(FIRST_RUN_KEY, value);
        editor.apply();
    }
  @Override
  public void onCreate() {
    
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    String baseChannelName = "YourBaseChannelName";
    SharedPreferences.Editor editor = getSharedPreferences("notiChannelName", Activity.MODE_PRIVATE).edit();
    editor.putString("notiChannelNameValue", generateUniqueChannelName(baseChannelName));
    editor.apply();

    if (isFirstRun()) {
      SharedPreferences.Editor editor_ = getSharedPreferences("notiSound", Activity.MODE_PRIVATE).edit();
      editor_.putString("notiSoundUrl", RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION).toString());
      editor_.apply();
      setFirstRunFlag(false);
    }
    
  }
}
