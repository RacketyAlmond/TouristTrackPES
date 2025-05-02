// components/navigation/UserStack.js
import React, { useState, View } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import BirthdateScreen from '../screens/BirthdateScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthProvider } from '../contexts/AuthContext'; // NUEVO
import { UserProvider } from '../contexts/UserContext'; // NUEVO
import { User } from 'firebase/auth';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  const [screen, setScreen] =
    (useState < 'Auth') | 'Birthdate' | ('Profile' > 'Auth');
  const [currentUser, setCurrentUser] = (useState < User) | (null > null);

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
              onComplete={() => setScreen('Profile')}
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
