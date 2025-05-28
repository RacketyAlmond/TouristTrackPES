import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../components/organisms/profile';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('react-i18next');

// Mock de react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

// Mock de imágenes
jest.mock('../public/logo.png', () => 'logo-mock');
jest.mock('../public/mapa.png', () => 'mapa-mock');

// Mock de Firebase
jest.mock('../firebaseConfig.js', () => ({
  auth: {
    currentUser: { uid: '123' },
  },
  db: {},
}));
jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => ({
        firstName: 'TestName',
        birthday: '01/01/2000',
        userLocation: 'Barcelona',
        about: 'Me gusta viajar',
        points: { current: 50 },
      }),
    }),
  ),
  doc: jest.fn(),
}));

jest.mock('../components/atoms/UserContext.js', () => ({
  useUser: () => ({
    updateUserData: jest.fn(),
    getUserPoints: jest.fn(() => Promise.resolve(50)),
    updateSignOut: jest.fn(),
  }),
}));

describe('Performance test for ProfileScreen', () => {
  it('renders and responds within 5 seconds', async () => {
    const start = Date.now();

    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen onSignOut={jest.fn()} />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(getByText('Barcelona')).toBeTruthy();
      expect(getByText('01/01/2000')).toBeTruthy();
      expect(getByText('Me gusta viajar')).toBeTruthy();
    });

    const end = Date.now();
    const duration = end - start;

    console.log(`⏱ Render time: ${duration}ms`);
    expect(duration).toBeLessThanOrEqual(5000);
  });
});
