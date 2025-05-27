/* eslint-disable prettier/prettier */
// components/navigation/UserStack.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../molecules/auth';
import BirthdateScreen from '../molecules/birthdate';
import ProfileScreen from './profile';
import { AuthProvider } from '../atoms/AuthContext'; // NUEVO
import { UserProvider } from '../atoms/UserContext';
import { auth } from '../../firebaseConfig.js'; // NUEVO
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

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
  const navigation = useNavigation();

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
          {/* In your Settings or Profile screen */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('NotificationTester')}
          >
            <View style={styles.settingItemIconContainer}>
              <MaterialIcons name="notifications" size={24} color="#572364" />
            </View>
            <View style={styles.settingItemTextContainer}>
              <Text style={styles.settingItemText}>Test Notifications</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </AuthProvider>
    </UserProvider>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItemIconContainer: {
    marginRight: 16,
  },
  settingItemTextContainer: {
    flex: 1,
  },
  settingItemText: {
    fontSize: 16,
    color: '#572364',
  },
});
