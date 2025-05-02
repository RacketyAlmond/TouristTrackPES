// UserContext.js
import React, { createContext, useState, useContext } from 'react';
import { auth, db } from '../../firebaseConfig.js';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  const createUserData = async (fname, birthday, userLocation, about) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No user is signed in');
    }

    try {
      await setDoc(doc(db, 'Users', user.uid), {
        firstName: fname,
        birthday: birthday,
        userLocation: userLocation,
        about: about,
      });

      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
      }

      console.log('User profile created/updated successfully!');
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      throw error;
    }
  };
  const updateUserData = async (fname, birthday, userLocation, about) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No user is signed in');
    }

    try {
      // Save to Firestore
      await updateDoc(doc(db, 'Users', user.uid), {
        firstName: fname,
        birthday: birthday,
        userLocation: userLocation,
        about: about,
      });

      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
      }

      console.log('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const getUserData = async () => {
    const user = auth.currentUser;

    try {
      if (!user) {
        throw new Error('No user is signed in');
      }

      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
      }

      console.log('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        createUserData,
        updateUserData,
        getUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
