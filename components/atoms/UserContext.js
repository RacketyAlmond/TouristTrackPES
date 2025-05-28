/* eslint-disable prettier/prettier */
// UserContext.js
import React, { createContext, useState, useContext } from 'react';
import { auth, db } from '../../firebaseConfig.js';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  const createUserData = async (
    fname,
    birthday,
    userLocation,
    about,
    points,
    avatar,
  ) => {
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
        points: points,
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

  const getUserForumComments = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error('No user is signed in');
      }

      console.log('Fetching forum activity for user', user.uid);

      // Usa la ruta correcta que tienes en el backend
      const response = await fetch(
        `***REMOVED***/forums/user-forum-comments/${user.uid}`,
      );

      if (!response.ok) {
        console.error('Response not OK:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch user forum comments');
      }

      const data = await response.json();
      console.log('Forum activity data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user forum comments:', error);
      throw error;
    }
  };

  const updateUserData = async (
    fname,
    birthday,
    userLocation,
    about,
    points,
  ) => {
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
        points: points,
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
  const updateSignOut = async () => {
    signOut(auth)
      .then(() => {
        console.log('Successfully signed out the user');
      })
      .catch((error) => {
        throw new Error('Error signing out');
      });
  };
  const getUserPoints = async () => {
    const user = auth.currentUser;
    try {
      if (!user) {
        throw new Error('No user is signed in');
      }

      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const rawPoints = data.points;

        console.log('Raw Points:', rawPoints);

        if (typeof rawPoints === 'object' && rawPoints?.current !== undefined) {
          return rawPoints.current;
        }

        if (typeof rawPoints === 'number') {
          return rawPoints;
        }

        return 0;
      }
    } catch (error) {
      console.error('Error fetching points:', error);
      throw error;
    }
  };

  const updateUserPoints = async (numberOfPoints) => {
    const user = auth.currentUser;
    try {
      if (!user) {
        throw new Error('No user is signed in');
      }

      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        let rawPoints = data.points;

        console.log('Raw Points:', rawPoints);

        if (typeof rawPoints === 'object' && rawPoints?.current !== undefined) {
          rawPoints.current += numberOfPoints;
          return rawPoints.current;
        }

        if (typeof rawPoints === 'number') {
          rawPoints += numberOfPoints;
          return rawPoints;
        }

        return 0;
      }
    } catch (error) {
      console.error('Error fetching points:', error);
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
        updateSignOut,
        getUserPoints,
        updateUserPoints,
        getUserForumComments,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
