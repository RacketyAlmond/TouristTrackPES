# Project Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Expo CLI: Install globally using:
  ```javascript
  npm install -g expo-cli
  ```
- A Firebase account
- A Google Cloud Console account (Only for Sign in with Google)

## Firebase Setup

1. Create a new Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard
   - Enable Authentication with Email/Password and Google Sign-in
   - Enable Firestore Database
   - Enable Storage

2. Obtain Firebase configuration:
   - In Firebase Console, go to Project Settings (⚙️ icon)
   - Under "General" tab, find "Your apps"
   - Click the web icon (</>)
   - Register app and copy the configuration object

3. Configure Firebase in your project:
   - Create a copy of the example configuration file:
     ```javascript
     copy firebaseConfig.example.js firebaseConfig.js
     ```
   - Open `firebaseConfig.js` and replace placeholder values with your Firebase config:
     ```javascript
     const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com"
     };
     ```

Detailed Firebase setup guide: [Firebase Documentation](https://firebase.google.com/docs/web/setup)

## Google Authentication Setup

1. Configure Google Sign-In:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Sign-In API
   - Create OAuth 2.0 credentials
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place these files in your project root

2. Configure OAuth in Firebase:
   - In Firebase Console, go to Authentication
   - Under Sign-in method, enable Google
   - Add your OAuth 2.0 Client ID and Client Secret

For detailed Google Auth setup (Not of much use but it's there): [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/ios/start-integrating)

## Environment Setup

1. Create local environment file:
   - Create a copy of the example environment file:
     ```javascript
     copy .env.example .env.local
     ```

2. Configure environment variables in `.env.local`:
   ```plaintext
   API_BASE_URL=your_backend_url
   GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
   GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id
   GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
   ```

## Installation and Running the Project

1. Install project dependencies:
   ```javascript
   npm install
   ```

2. Start the development server:
   ```javascript
   npm start
   ```

3. Run on your device/emulator:
   - Scan QR code with Expo Go app (iOS/Android)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator




## Troubleshooting

If you encounter authentication issues:
- Verify OAuth 2.0 credentials are correctly configured
- Ensure `google-services.json` and `GoogleService-Info.plist` are properly placed
- Check if all required APIs are enabled in Google Cloud Console
- Verify Firebase configuration in `firebaseConfig.js`

Common errors:
1. "Google Sign-In failed":
   - Check if Google Cloud Console credentials match your `.env.local`
   - Verify OAuth consent screen is properly configured

2. "Firebase configuration error":
   - Ensure all required fields in `firebaseConfig.js` are filled correctly
   - Verify Firebase project settings match your configuration

## Additional Resources

- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Setup Guide](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Storage Guide](https://firebase.google.com/docs/storage)

## Support

For issues and questions, please [open an issue](https://github.com/RacketyAlmond/TouristTrackPES/issues) on GitHub.








https://github.com/user-attachments/assets/68e458e1-94dc-44d6-8f06-d5044b8cc8d4

