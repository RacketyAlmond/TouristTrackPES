// components/navigation/UserStack.js
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../molecules/auth';
import BirthdateScreen from '../molecules/birthdate';
import ProfileScreen from './profile';
import { AuthProvider } from '../atoms/AuthContext'; // NUEVO
import { UserProvider } from '../atoms/UserContext';
import {auth} from "../../firebaseConfig.js"; // NUEVO

const Stack = createNativeStackNavigator();

export default function UserStack() {
  const [screen, setScreen] = useState('Profile');
  const [currentUser, setCurrentUser] = useState('notSelected');
  const getAuthenticated = () => {
    (auth.currentUser == null) ?
    setScreen('Auth') :
        console.log(`user authenticated = ${auth.currentUser}`)
    return auth.currentUser
  }
  useEffect(() => {
    getAuthenticated();
  }, []);

    return (
    <UserProvider>
      <AuthProvider>
        <View style={{ flex: 1 }}>
          {screen === 'Auth' && (
            <AuthScreen
              onAuthenticated={(user, isNewUser) => {
                setCurrentUser(user);
                setScreen(isNewUser ? 'Birthdate' : 'Profile');
              }}
            />
          )}
          {screen === 'Birthdate' && (
            <BirthdateScreen
              user={currentUser}
              onComplete={(status) =>
                  setScreen(status ? 'Profile' : 'Birthdate')}
            />
          )}
          {screen === 'Profile' && (
            <ProfileScreen
              user={currentUser}
              onSignOut={() => setScreen('Auth')}
            />
          )}
        </View>
      </AuthProvider>
    </UserProvider>
  );
}
