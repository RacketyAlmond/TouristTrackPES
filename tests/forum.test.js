import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Forum from '../components/organisms/forum';
import { NavigationContainer } from '@react-navigation/native';

// 👇 Solución al error: definir React dentro de cada mock
jest.mock('../components/atoms/title', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ title }) => <Text>{title}</Text>;
});

jest.mock('../components/atoms/question', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Question</Text>;
});

jest.mock('../components/molecules/foroSearchBar', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View testID='foro-search-bar' />;
});

// Mock de fetch
global.fetch = jest.fn((url) => {
  if (url.includes('/forums/123/preguntas')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          preguntas: [
            {
              id: 'q1',
              text: '¿Cuál es la mejor playa?',
              Author: 'user1',
              date: { _seconds: 1684852957 },
            },
          ],
        }),
    });
  }

  if (url.includes('/users/user1')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          usuario: {
            firstName: 'Ana',
            userLocation: 'España',
          },
        }),
    });
  }

  return Promise.reject(new Error('Unexpected fetch URL'));
});

describe('Forum component', () => {
  const route = {
    params: {
      forumId: '123',
      localityName: 'Barcelona',
    },
  };

  it('renderiza correctamente y muestra preguntas', async () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <Forum route={route} />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(getByText('Barcelona')).toBeTruthy(); // Título mockeado
      expect(getByText('Question')).toBeTruthy(); // Componente mockeado
      expect(getByTestId('foro-search-bar')).toBeTruthy(); // SearchBar mockeado
    });
  });
});
