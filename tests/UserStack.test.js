import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import UserStack from '../components/organisms/UserStack';

jest.mock('../firebaseConfig.js', () => ({
  auth: {
    currentUser: { uid: '123' }, // Simula usuario autenticado
  },
}));

jest.mock('../components/molecules/auth', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text testID='auth-screen'>AuthScreen</Text>;
});

jest.mock('../components/molecules/birthdate', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text testID='birthdate-screen'>BirthdateScreen</Text>;
});

jest.mock('../components/organisms/profile', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text testID='profile-screen'>ProfileScreen</Text>;
});

jest.mock('../components/atoms/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
}));

jest.mock('../components/atoms/UserContext', () => ({
  UserProvider: ({ children }) => children,
}));

describe('UserStack component', () => {
  it('renderiza ProfileScreen por defecto', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <UserStack />
      </NavigationContainer>,
    );
    expect(getByTestId('profile-screen')).toBeTruthy();
  });
});
