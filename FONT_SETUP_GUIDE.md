# Lato Font Setup Guide for StoneApp App

## 📋 Required Font Files

You need to download these 4 Lato TTF files and place them in the correct
directories:

### Font Files Needed:

- **Lato-Regular.ttf** (400 weight)
- **Lato-Medium.ttf** (500 weight)
- **Lato-SemiBold.ttf** (600 weight)
- **Lato-Bold.ttf** (700 weight)

## 📁 File Placement

### 1. Source Directory (for React Native CLI linking):

Place all 4 TTF files in:

```
src/assets/fonts/
├── Lato-Regular.ttf
├── Lato-Medium.ttf
├── Lato-SemiBold.ttf
└── Lato-Bold.ttf
```

### 2. Android Directory:

Copy the same 4 files to:

```
android/app/src/main/assets/fonts/
├── Lato-Regular.ttf
├── Lato-Medium.ttf
├── Lato-SemiBold.ttf
└── Lato-Bold.ttf
```

### 3. iOS Directory:

Copy the same 4 files to:

```
ios/StoneApp/Fonts/
├── Lato-Regular.ttf
├── Lato-Medium.ttf
├── Lato-SemiBold.ttf
└── Lato-Bold.ttf
```

## 🔧 Setup Commands

After placing the font files, run these commands:

```bash
# 1. Link fonts using React Native CLI
npx react-native-asset

# 2. For iOS, clean and rebuild
cd ios && rm -rf build && cd ..
npx react-native run-ios --reset-cache

# 3. For Android, clean and rebuild
cd android && ./gradlew clean && cd ..
npx react-native run-android --reset-cache
```

## 📱 Platform-Specific Notes

### iOS:

- Fonts will be automatically added to Info.plist by react-native-asset
- Font names in iOS: "Lato-Regular", "Lato-Medium", etc.

### Android:

- Fonts will be copied to assets/fonts/
- Font names in Android: "Lato-Regular", "Lato-Medium", etc.

## ✅ Verification

After setup, all text in your app will use Lato fonts:

- Headers will use Lato-Bold and Lato-SemiBold
- Body text will use Lato-Regular
- Buttons and emphasis will use Lato-Medium

## 🚨 Important

Make sure to:

1. Download genuine Lato fonts from Google Fonts
2. Keep consistent naming (Lato-Regular.ttf, etc.)
3. Place files in ALL three directories mentioned above
4. Run the setup commands after placing files
