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
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
