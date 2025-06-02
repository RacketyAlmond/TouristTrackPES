import React, { createContext, useState, useContext } from 'react';
import { auth, db } from '../../firebaseConfig.js';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { API_BASE_URL } from '../../config';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  const createUserData = async (
    fname,
    birthday,
    userLocation,
    about,
    points,
    profileImage,
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
        profileImage: profileImage,
      });

      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
      }
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

      const response = await fetch(
        `${API_BASE_URL}/forums/user-forum-comments/${user.uid}`,
      );

      if (!response.ok) {
        console.error('Response not OK:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch user forum comments');
      }

      const data = await response.json();
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
    profileImage,
  ) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No user is signed in');
    }

    try {
      await updateDoc(doc(db, 'Users', user.uid), {
        firstName: fname,
        birthday: birthday,
        userLocation: userLocation,
        about: about,
        points: points,
        profileImage: profileImage,
      });
      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
      }
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
        let currentPoints = data.points;
        let updatedPoints;

        if (
          typeof currentPoints === 'object' &&
          currentPoints?.current !== undefined
        ) {
          updatedPoints = {
            ...currentPoints,
            current: currentPoints.current + numberOfPoints,
          };
        } else if (typeof currentPoints === 'number') {
          updatedPoints = currentPoints + numberOfPoints;
        } else {
          updatedPoints = { current: numberOfPoints };
        }

        await updateDoc(doc(db, 'Users', user.uid), {
          points: updatedPoints,
        });

        setUserData((prevData) => ({
          ...prevData,
          points: updatedPoints,
        }));

        return typeof updatedPoints === 'object'
          ? updatedPoints.current
          : updatedPoints;
      }

      return 0;
    } catch (error) {
      console.error('Error updating points:', error);
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
