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
      }),
    }),
  ),
  doc: jest.fn(),
}));

// Mock del contexto
jest.mock('../components/atoms/UserContext.js', () => ({
  useUser: () => ({
    updateUserData: jest.fn(),
    getUserPoints: jest.fn(() => Promise.resolve(50)),
  }),
}));

describe('ProfileScreen component', () => {
  it('renderiza correctamente el perfil de usuario', async () => {
    const { getAllByText, getByText } = render(
      <NavigationContainer>
        <ProfileScreen onSignOut={jest.fn()} />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(getAllByText('TestName').length).toBeGreaterThan(0);
      expect(getByText('Barcelona')).toBeTruthy();
      expect(getAllByText('Sobre mí').length).toBeGreaterThan(0);
      expect(getByText('01/01/2000')).toBeTruthy();
      expect(getByText('Me gusta viajar')).toBeTruthy();
    });
  });
});
