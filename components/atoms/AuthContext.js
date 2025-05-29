/* eslint-disable prettier/prettier */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../../firebaseConfig.js';
import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      '***REMOVED***',
    scopes: ['profile', 'email'],
    redirectUri: '***REMOVED***',
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
      } catch (error) {
        console.error('Error getting push token:', error);
        setToken('Error getting token: ' + error.message);
      }
    }

    getToken();
  }, []);

  const saveTokenToBackend = async (userId) => {
    try {
      const userIdToUse = userId;

      const saveTokenUrl = `***REMOVED***/users/${userIdToUse}/push-token`;
      const response = await fetch(saveTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pushToken: token,
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
    return user;
  };

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

  const signInWithGoogle = async (accessToken) => {
    const credential = GoogleAuthProvider.credential(null, accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
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
