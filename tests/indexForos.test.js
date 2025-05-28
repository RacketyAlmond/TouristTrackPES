// tests/indexForos.test.js
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import IndexForos from '../components/organisms/indexForos';
import { NavigationContainer } from '@react-navigation/native';

// 👇 MOCKS CON REACT Y TEXT DENTRO DE CADA FÁBRICA
jest.mock('../components/atoms/title', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text testID='mock-title'>Foros</Text>;
});

jest.mock('../components/atoms/titleLocalidadForo', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ LocName }) => <Text>{LocName}</Text>;
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
  };
});

// 👇 MOCK DEL FETCH
global.fetch = jest.fn((url) => {
  if (url.endsWith('/forums')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          forums: [
            { id: '1', Localidad: 'Madrid' },
            { id: '2', Localidad: 'Barcelona' },
          ],
        }),
    });
  }
  return Promise.reject(new Error('Unknown URL'));
});

describe('IndexForos component', () => {
  it('renderiza correctamente las localidades de foros', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <IndexForos />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(getByText('Madrid')).toBeTruthy();
      expect(getByText('Barcelona')).toBeTruthy();
    });
  });

  it('filtra correctamente por localidad', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <NavigationContainer>
        <IndexForos />
      </NavigationContainer>,
    );

    const input = getByPlaceholderText('search');
    fireEvent.changeText(input, 'Madrid');

    await waitFor(() => {
      expect(getByText('Madrid')).toBeTruthy();
      expect(queryByText('Barcelona')).toBeNull();
    });
  });

  it('muestra el formulario de creación cuando no hay coincidencias', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <IndexForos />
      </NavigationContainer>,
    );

    const input = getByPlaceholderText('search');
    fireEvent.changeText(input, 'Zaragoza');

    await waitFor(() => {
      expect(getByText('Crea un nuevo foro')).toBeTruthy();
    });
  });
});
