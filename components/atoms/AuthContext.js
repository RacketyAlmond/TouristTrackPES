/* eslint-disable prettier/prettier */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../../firebaseConfig.js';
import { setDoc, doc } from 'firebase/firestore'; //En node module si tieneis firebase instalado ;P
import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as AuthSession from 'expo-auth-session';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      '1096375029000-bl6bd1lvlji21jfpqdri55ejopbg7j81.apps.googleusercontent.com',
    webClientId:
      '***REMOVED***',
    androidClientId:
      '1096375029000-7vfrm90mbcftgqinj4klh1lnpfeclff9.apps.googleusercontent.com',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function getToken() {
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });
        setToken(tokenData.data);
        console.log('Push token:', tokenData.data);
      } catch (error) {
        console.error('Error getting push token:', error);
        setToken('Error getting token: ' + error.message);
      }
    }
    
    getToken();
  }, []);

  const saveTokenToBackend = async (userId) => {
    try {
      const userIdToUse = userId
      
      const saveTokenUrl = `***REMOVED***/users/${userIdToUse}/push-token`;
      const response = await fetch(saveTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pushToken: token
        }),
      });
      
      if (response.ok) {
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to save token: ${errorText}`);
      }
    } catch (error) {
      console.error('Error saving token:', error);
      Alert.alert('Error', `Could not save token: ${error.message}`);
    }
  };

  useEffect(() => {
    const signInWithGoogleAsync = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
      }
    };
    signInWithGoogleAsync();
  }, [response]);

  const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    saveTokenToBackend(user.uid);
    return user;
  };

  const updateProfileData = async (username, photoURL) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error('No user is signed in');
      }
      await createUserData(user, {
        displayName: username,
        photoURL: photoURL,
      });

      console.log('User profile updated successfully!');
      return user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  /*
  const createUserData = async (fname, birthday, userLocation, points) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error('No user is signed in');
      }

      console.log(fname);

      await setDoc(doc(db, 'Users', user.uid), {
        email: user.email,
        firstName: fname,
        birthday: birthday,
        userLocation: userLocation,
        points: points
      });

      console.log('User profile updated successfully!');
      return user;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };
*/
  const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    saveTokenToBackend(userCredential.user.uid);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const signInWithGoogle = async () => {
    await promptAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        updateProfileData,
        signIn,
        logout,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
