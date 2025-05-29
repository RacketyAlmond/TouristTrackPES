import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import AuthScreen from '../molecules/auth';
import BirthdateScreen from '../molecules/birthdate';
import ProfileScreen from './profile';
import { AuthProvider } from '../atoms/AuthContext';
import { UserProvider } from '../atoms/UserContext';
import { auth } from '../../firebaseConfig.js';

export default function UserStack() {
  const [screen, setScreen] = useState('Profile');
  const [currentUser, setCurrentUser] = useState('notSelected');
  const getAuthenticated = () => {
    auth.currentUser == null
      ? setScreen('Auth')
      : console.log(`user authenticated = ${auth.currentUser}`);
    return auth.currentUser;
  };
  useEffect(() => {
    getAuthenticated();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
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
                  setScreen(status ? 'Profile' : 'Birthdate')
                }
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
    </ScrollView>
  );
}
