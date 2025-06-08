<p align="center">
<img src="https://github.com/user-attachments/assets/c8848fad-0ab3-4bf3-8fe5-0b337692260f" alt="logo" style="width:50%; height:auto;">
</p>
<div align="center">
<p><em>A comprehensive tourism analytics and social networking platform for Spain</em></p>
</div>

## 🌟 What is TouristTrackPES?

*TouristTrackPES* is a React Native mobile application that transforms how people explore and understand tourism in Spain. By combining *real-time data visualization*, *social networking*, and *gamification*, it creates a unique platform where travelers, tourism professionals, and data enthusiasts can discover, share, and engage with Spain's tourism landscape.
<br>
### 🎯 The Problem We Solve

Spain is one of the world's top tourist destinations, but accessing and understanding tourism data has traditionally been limited to industry professionals. TouristTrackPES democratizes this information, making tourism analytics accessible and engaging for everyone while fostering a community of travel enthusiasts.
<br>
### 💡 Our Approach

The app bridges the gap between *data and community* by offering:

- *📊 Interactive Data Visualization*: Transform complex tourism statistics into intuitive, visual experiences


- *🤝 Social Connectivity*: Connect travelers through forums and real-time chat


- *🎮 Engagement Through Gamification*: Reward user participation with points, levels, and achievements


- *📱 Mobile-First Experience*: Native iOS/Android apps with full web compatibility
<br>
## 🌍 Core Functionality


<ul>
  <li><strong>Interactive map</strong> of Spain with color-coded tourist volume</li><br>
  <li><strong>Filter menu</strong> to select:
    <ul>
      <li>Year and month</li>
      <li>Country of origin</li>
    </ul>
  </li><br>
  <li><strong>Tooltips</strong> with:
    <ul>
      <li>Number of tourists</li>
      <li>Tourist's country of origin</li>
    </ul>
  </li><br>
  <li>User management:
    <ul>
      <li>Log in / Sign up / Log out</li>
      <li>Edit user details</li>
      <li>Set profile picture</li>
    </ul>
  </li><br>
  <li>Region rating system</li><br>
  <li>Google Sign-In support</li><br>
  <li>Multilanguage interface</li><br>
  <li>Trend graphs showing tourism evolution</li><br>
  <li>Forums (general & municipality-specific)</li><br>
  <li>Private chat + message notifications (When app is closed)</li><br>
  <li>Geolocation</li><br>
  <li>Gamification system:
    <ul>
      <li>Earn points through rating municipalities and forum activity</li>
      <li>Level up and unlock profile changes</li>
    </ul>
  </li>






<br/>
<br/>







https://github.com/user-attachments/assets/c929db0c-e31d-4965-80c6-725f4b12a1b5



https://github.com/user-attachments/assets/0f7bdffd-bba6-45f8-ba38-476b22c3e46f



https://github.com/user-attachments/assets/9c947376-f671-46dd-bf14-24a227078451



https://github.com/user-attachments/assets/9fbea1c7-9cec-44e5-bfc8-ff612e1b8db4




https://github.com/user-attachments/assets/85ca535d-c300-4fbf-a073-8c04f4514e7d




<br/><br/>

### Key technologies utilized:

<p align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/4eb6b1d1-68b4-496e-9b3d-040f020471e3" alt="logo1" style="width: 5vw; max-width: 80px; height: auto; border-radius: 50%;" />
  <img src="https://github.com/user-attachments/assets/3657b0b1-4eb6-444a-a925-c78ccb384d82" alt="logo2" style="width: 6vw; max-width: 80px; height: auto; border-radius: 50%;" />
  <img src="https://github.com/user-attachments/assets/b16638d3-4f7b-4c52-8b59-bfb8e055d273" alt="logo3" style="width: 6vw; max-width: 80px; height: auto; border-radius: 50%;" />
  <img src="https://github.com/user-attachments/assets/c4ecdea3-9e4c-4489-90be-1837774541bd" alt="logo4" style="width: 8vw; max-width: 120px; height: auto; border-radius: 50%;" />
  
  <img src="https://github.com/user-attachments/assets/47fa1072-e873-4a6b-9fd2-1100a16b71c9" alt="logo5" style="width: 6vw; max-width: 80px; height: auto; border-radius: 50%;" />
  <img src="https://github.com/user-attachments/assets/0d2d846e-b92e-40c9-8ad2-72502f6dccf3" alt="logo6" style="width: 6vw; max-width: 80px; height: auto; border-radius: 50%;" />
  <img src="https://github.com/user-attachments/assets/2bc943f9-ebe4-4ce9-9ae1-671cedbe2ef7" alt="logo7" style="width: 6vw; max-width: 80px; height: auto; border-radius: 50%;" />
  
  <img src="https://github.com/user-attachments/assets/fd1a12ac-6b26-41c3-b205-55e7b662bbb0" alt="logo8" style="width: 6vw; max-width: 80px; height: auto; border-radius: 50%;" />
  <img src="https://github.com/user-attachments/assets/b02d2a67-abec-4b7a-b951-cf5004f2b7e3" alt="logo9" style="width: 5vw; max-width: 80px; height: auto; border-radius: 50%;" />
  <img src="https://github.com/user-attachments/assets/e158882f-05df-42a4-b8c9-e67170056458" alt="logo10" style="width: 6vw; max-width: 80px; height: auto; border-radius: 50%;" />
</p>


<br/><br/>





### System Architecture:

<p>
<img src="https://github.com/user-attachments/assets/34ce45a3-7486-4cb8-9db6-c960e85b21b5" alt="System Architecture" style="width: 100%; height: auto; margin-top: 20px;" />
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











