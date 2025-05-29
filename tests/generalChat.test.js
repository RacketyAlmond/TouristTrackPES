import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Chats from '../components/organisms/generalChat';
import { NavigationContainer } from '@react-navigation/native';

// Mocks
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: () => React.createElement('Text', {}, 'Icon'),
  };
});

jest.mock('../components/atoms/chatItem', () => {
  const React = require('react');
  return ({ item }) => React.createElement('Text', {}, item.name);
});

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
    useFocusEffect: jest.fn(),
  };
});

jest.mock('../firebaseConfig.js', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid-123',
    },
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        search: 'Search for a Chat...',
        'delete-chat': 'Delete chat',
        sure: 'Are you sure you want to delete',
        cancel: 'Cancel',
        delete: 'Delete',
        success: 'Success',
        final1: 'You have deleted',
        final2: 'successfully',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock fetch con points agregados (importante para que tu componente no falle)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          id: '1',
          firstName: 'User One',
          about: 'About one',
          avatar: 'https://example.com/avatar1.jpg',
          points: { current: 10 },
        },
        {
          id: '2',
          firstName: 'User Two',
          about: 'About two',
          avatar: 'https://example.com/avatar2.jpg',
          points: { current: 5 },
        },
      ]),
  }),
);

describe('Chats component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente los chats', async () => {
    const { findByText } = render(
      <NavigationContainer>
        <Chats />
      </NavigationContainer>,
    );

    expect(await findByText('User One')).toBeTruthy();
    expect(await findByText('User Two')).toBeTruthy();
  });

  it('filtra los chats al escribir en la barra de búsqueda', async () => {
    const { findByText, getByPlaceholderText, queryByText } = render(
      <NavigationContainer>
        <Chats />
      </NavigationContainer>,
    );

    // Espera a que carguen los chats
    await findByText('User One');

    const input = getByPlaceholderText('Search for a Chat...');
    fireEvent.changeText(input, 'two');

    expect(queryByText('User One')).toBeNull();
    expect(await findByText('User Two')).toBeTruthy();
  });
});
