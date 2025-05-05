// components/navigation/UserStack.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../molecules/auth';
import BirthdateScreen from '../molecules/birthdate';
import ProfileScreen from './profile';
import { AuthProvider } from '../atoms/AuthContext'; // NUEVO
import { UserProvider } from '../atoms/UserContext'; // NUEVO

const Stack = createNativeStackNavigator();

export default function UserStack() {
  const [screen, setScreen] = useState('Profile');
  const [currentUser, setCurrentUser] = useState('notSelected');

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
