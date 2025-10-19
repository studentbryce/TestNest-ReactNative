# TestNest Android APK Build Instructions

## Current Status
- ✅ EAS CLI installed and configured
- ✅ Project configured for Android builds
- ✅ Development server working with `npx expo start`

## Build Options

### Option 1: Expo Go (Immediate Testing)
1. Install "Expo Go" app from Google Play Store
2. Run `npx expo start` in your project directory
3. Scan QR code with Expo Go app
4. Test your app immediately

### Option 2: EAS Build (Cloud APK)
1. Create account at https://expo.dev
2. Run `eas login` and enter your credentials
3. Run `eas build --platform android --profile preview`
4. Download APK when build completes (usually 5-10 minutes)

### Option 3: Expo Web Interface
1. Go to https://expo.dev
2. Create/login to account
3. Create new project or link existing
4. Upload project files
5. Use web interface to trigger builds

### Option 4: Manual APK Generation
1. Generate keystore manually:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Use keystore with EAS build

## Recommended Approach
For development and testing: **Use Expo Go** (Option 1)
For production APK: **Use EAS Web Interface** (Option 3)

## Current EAS Configuration
- Preview builds generate APK files
- Production builds generate AAB files for Google Play Store
- Development builds require Expo Development Client

## Next Steps
1. Try Expo Go for immediate testing
2. Create Expo account for APK builds
3. Consider ejecting to React Native CLI for full control
