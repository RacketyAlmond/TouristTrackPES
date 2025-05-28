import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import Chats from '../components/organisms/generalChat';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';

// ✅ Mocks
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

// ✅ Navigation con solo useNavigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
    useFocusEffect: jest.fn(), // <- No se ejecuta automáticamente
  };
});

// ✅ Mock fetch
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
        },
        {
          id: '2',
          firstName: 'User Two',
          about: 'About two',
          avatar: 'https://example.com/avatar2.jpg',
        },
      ]),
  }),
);

describe('Chats component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente los chats', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Chats />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(getByText('User One')).toBeTruthy();
      expect(getByText('User Two')).toBeTruthy();
    });
  });

  it('filtra los chats al escribir en la barra de búsqueda', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <NavigationContainer>
        <Chats />
      </NavigationContainer>,
    );

    await waitFor(() => getByText('User One'));

    const input = getByPlaceholderText('Search for a Chat...');
    fireEvent.changeText(input, 'two');

    expect(queryByText('User One')).toBeNull();
    expect(getByText('User Two')).toBeTruthy();
  });
});
