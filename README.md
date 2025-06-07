

<p align="center">


<img src="https://github.com/user-attachments/assets/c8848fad-0ab3-4bf3-8fe5-0b337692260f" alt="logo" style="width:50%; height:auto;">
</p>
<div align="center">
TourisTrack - Your go-to app for connecting with travellers
</div>

## 🌍 Overview

**TourisTrack** is a mobile application developed in React Native's expo that provides a visual and interactive experience of tourism trends across Spain. It helps travelers explore:

- **Tourist density by region**
- **Monthly and historical trends**
- **Visitor country of origin**
- **Insights through a dynamic map interface**

It also includes **forums** and **private chats** to connect with other users. All data is pulled **weekly** from Spain’s official *Ministerio de Industria y Turismo*.

---

## Key Features

<ul>
  <li>🗺️ <strong>Interactive map</strong> of Spain with color-coded tourist volume</li><br>
  <li>🎛️ <strong>Filter menu</strong> to select:
    <ul>
      <li>Year and month</li>
      <li>Country of origin</li>
    </ul>
  </li><br>
  <li>📌 <strong>Tooltips</strong> with:
    <ul>
      <li>Number of tourists</li>
      <li>Tourist's country of origin</li>
    </ul>
  </li><br>
  <li>👤 User management:
    <ul>
      <li>Log in / Sign up / Log out</li>
      <li>Edit user details</li>
      <li>Set profile picture</li>
    </ul>
  </li><br>
  <li>⭐ Region rating system</li><br>
  <li>🔐 Google Sign-In support</li><br>
  <li>🌐 Multilanguage interface</li><br>
  <li>📈 Trend graphs showing tourism evolution</li><br>
  <li>💬 Forums (general & municipality-specific)</li><br>
  <li>📨 Private chat + message notifications (When app is closed)</li><br>
  <li>📍 Geolocation</li><br>
  <li>🎮 Gamification system:
    <ul>
      <li>Earn points through rating municipalities and forum activity</li>
      <li>Level up and unlock profile changes</li>
    </ul>
  </li>






<br/>
<br/>






https://github.com/user-attachments/assets/352fc121-3a02-43f3-8eea-ad5ddbb999f1




<br/><br/>

### Key technologies utilized:

<p>
  <img src="https://github.com/user-attachments/assets/4eb6b1d1-68b4-496e-9b3d-040f020471e3" alt="logo1" width="40" height="40" style="border-radius: 50%; margin-right: 8px;"/>
  <img src="https://github.com/user-attachments/assets/3657b0b1-4eb6-444a-a925-c78ccb384d82" alt="logo2" width="50" height="40" style="border-radius: 50%; margin-right: 8px;"/>
  <img src="https://github.com/user-attachments/assets/87b4f8a9-fbe9-4e6e-9900-55996606c918" alt="logo3" width="80" height="40" style="border-radius: 50%; margin-right: 8px;"/>
  <img src="https://github.com/user-attachments/assets/c4ecdea3-9e4c-4489-90be-1837774541bd" alt="logo4" width="80" height="40" style="border-radius: 50%; margin-right: 8px;"/>
  
  <img src="https://github.com/user-attachments/assets/741946d6-48a6-4578-9aa8-5a8082cf04d2" alt="logo5" width="70" height="60" style="border-radius: 50%; margin-right: 8px;"/>
  <img src="https://github.com/user-attachments/assets/b40d6725-44b3-4a84-a060-b4008578d79a" alt="logo6" width="40" height="40" style="border-radius: 50%; margin-right: 8px;"/>
  <img src="https://github.com/user-attachments/assets/96ae6085-f5aa-45f4-898c-2a0192540e0f" alt="logo7" width="40" height="40" style="border-radius: 50%; margin-right: 8px;"/>
  
  <img src="https://github.com/user-attachments/assets/fd1a12ac-6b26-41c3-b205-55e7b662bbb0" alt="logo8" width="40" height="40" style="border-radius: 50%; margin-right: 8px;"/>
  <img src="https://github.com/user-attachments/assets/b02d2a67-abec-4b7a-b951-cf5004f2b7e3" alt="logo9" width="40" height="40" style="border-radius: 50%; margin-right: 8px;"/>
  <img src="https://github.com/user-attachments/assets/e158882f-05df-42a4-b8c9-e67170056458" alt="logo10" width="40" height="40" style="border-radius: 50%; margin-right: 8px;"/>
</p>

<br/><br/>

### System Architecture:

<p>
  <img src="https://github.com/user-attachments/assets/34ce45a3-7486-4cb8-9db6-c960e85b21b5" alt="System Architecture" width="600" style="margin-top: 20px;"/>
</p>






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


## Google Authentication Setup (OPTIONAL)

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











