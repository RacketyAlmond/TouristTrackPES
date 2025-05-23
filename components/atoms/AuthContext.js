// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../../firebaseConfig.js';
import { setDoc, doc } from 'firebase/firestore'; //En node module si tieneis firebase instalado ;P
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, updateProfileData, signIn, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
