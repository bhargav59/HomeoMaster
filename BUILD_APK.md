# HomeoMaster - APK Build Instructions

## Option 1: Cloud Build with EAS (Recommended - Easiest)

This is the simplest method and doesn't require Android Studio or local setup.

### Steps:

1. **Create an Expo account** (if you don't have one):
   - Go to https://expo.dev/signup
   - Sign up with your email

2. **Login to EAS CLI**:
   ```bash
   cd /Users/bhaskar/Downloads/HomeoMaster/app
   npx eas-cli login
   ```

3. **Build the APK**:
   ```bash
   npx eas-cli build --platform android --profile preview
   ```

4. **Download the APK**:
   - The build will run on Expo's servers (takes ~10-15 minutes)
   - You'll get a link to download the APK when it's done
   - Or check https://expo.dev/accounts/[your-username]/projects/homeomaster/builds

**Note**: The `preview` profile in `eas.json` is configured to build an APK (not AAB), which you can directly install on Android devices.

---

## Option 2: Local Build (Advanced - Requires Android Studio)

This requires more setup but gives you full control.

### Prerequisites:

1. **Install Android Studio**:
   - Download from https://developer.android.com/studio
   - Install Android SDK (API 34 or latest)
   - Set up environment variables:
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/tools/bin
     ```

2. **Install Java JDK 17**:
   ```bash
   brew install openjdk@17
   ```

### Build Steps:

1. **Prebuild the native Android project**:
   ```bash
   cd /Users/bhaskar/Downloads/HomeoMaster/app
   npx expo prebuild --platform android
   ```

2. **Build the APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Find your APK**:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## Option 3: Quick Test Build (Development APK)

For testing purposes, you can create a development build:

```bash
cd /Users/bhaskar/Downloads/HomeoMaster/app
npx expo export:embed --platform android --bundle-output android-bundle.js
```

Then use Android Studio to build, or:

```bash
npx eas-cli build --platform android --profile development --local
```

---

## Current Configuration

Your app is configured with:
- **Package Name**: `com.homeomaster.app`
- **Version**: 1.0.0
- **Version Code**: 1
- **Build Type**: APK (for easy installation)

The `eas.json` file has been created with three profiles:
- **development**: For development builds with debugging
- **preview**: For testing APK builds (recommended for you)
- **production**: For production-ready builds

---

## Recommended Approach for You

I recommend **Option 1 (EAS Cloud Build)** because:
- ✅ No Android Studio installation needed
- ✅ No complex environment setup
- ✅ Builds on Expo's servers
- ✅ Free for personal projects
- ✅ Get a downloadable APK in ~15 minutes

Just run:
```bash
cd /Users/bhaskar/Downloads/HomeoMaster/app
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

The APK will be ready to download and install on any Android device!
