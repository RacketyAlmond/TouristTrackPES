import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Map from '../components/organisms/map';

// Mocks
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ setOptions: jest.fn() }),
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' }),
  ),
  hasServicesEnabledAsync: jest.fn(() => Promise.resolve(true)),
  watchPositionAsync: jest.fn((_options, callback) => {
    callback({
      coords: {
        latitude: 41.3851,
        longitude: 2.1734,
      },
    });
    return { remove: jest.fn() };
  }),
  Accuracy: {
    High: 1,
  },
}));

jest.mock('../utils', () => ({
  getCoordinatesFromCity: jest.fn().mockResolvedValue({
    lat: 41.3851,
    lon: 2.1734,
    name: 'Barcelona',
  }),
}));

jest.mock('../dataestur', () => ({
  listOriginCountries: jest.fn().mockResolvedValue([]),
  getSummaryData: jest.fn().mockResolvedValue([]),
  getTotalTouristsOfMunicipality: jest.fn().mockReturnValue(1000),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    FontAwesome: (props) => <Text>{`FontAwesome ${props.name}`}</Text>,
    MaterialIcons: (props) => <Text>{`MaterialIcons ${props.name}`}</Text>,
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Devuelve el key directamente (sin traducción)
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ setOptions: jest.fn() }),
  useFocusEffect: (callback) => callback(), // ejecuta el efecto directamente para testing
}));

global.fetch = jest.fn().mockImplementation((url) => {
  if (url.includes('forums/localidad')) {
    return Promise.resolve({
      json: () => Promise.resolve({ success: true, forum: { id: 42 } }),
    });
  }
  return Promise.resolve({
    json: () => Promise.resolve({ success: true, forumId: 43 }),
  });
});

describe('⏱ Map component - tiempo de respuesta', () => {
  it('completa búsqueda y renderizado en menos de 5 segundos', async () => {
    const start = performance.now();

    const { getByPlaceholderText } = render(<Map />);

    const searchInput = getByPlaceholderText('search.placeholder');

    fireEvent.changeText(searchInput, 'Barcelona');
    fireEvent(searchInput, 'submitEditing');

    // Esperamos al marcador de la ciudad, que indica que el sistema respondió
    await waitFor(
      () => {
        // Este marcador aparece cuando la ciudad y coords están listos
        // Lo puedes mejorar usando testID si tu componente tiene uno
        expect(fetch).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );

    const end = performance.now();
    const duration = end - start;

    console.log(`⏱ Tiempo total: ${duration.toFixed(2)}ms`);

    expect(duration).toBeLessThan(5000);
  });
});
