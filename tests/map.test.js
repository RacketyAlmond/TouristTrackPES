import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Map from '../components/organisms/map';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      setOptions: jest.fn(), // <-- agregar esta línea
    }),
    useFocusEffect: jest.fn(),
  };
});

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = (props) => <View {...props} testID='mock-map-view' />;
  const MockMarker = (props) => <View {...props} testID='mock-marker' />;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

jest.mock('expo-location', () => ({
  hasServicesEnabledAsync: jest.fn().mockResolvedValue(true),
  requestForegroundPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: 'granted' }),
  watchPositionAsync: jest.fn((_, callback) => {
    callback({
      coords: { latitude: 40.4168, longitude: -3.7038 },
    });
    return { remove: jest.fn() };
  }),
  Accuracy: { High: 1 },
}));

jest.mock('../components/molecules/searchBar', () => () => {
  const { Text } = require('react-native');
  return <Text>SearchBar</Text>;
});

jest.mock('../components/molecules/InfoLocalidad', () => () => {
  const { Text } = require('react-native');
  return <Text>InfoLocalidad</Text>;
});

jest.mock('../components/atoms/area', () => () => {
  const { Text } = require('react-native');
  return <Text>Area</Text>;
});

// Mock de utilidades
jest.mock('../utils', () => ({
  getCoordinatesFromCity: jest.fn().mockResolvedValue({
    lat: 40.4168,
    lon: -3.7038,
    name: 'Madrid',
  }),
}));

jest.mock('../dataestur', () => ({
  listOriginCountries: jest
    .fn()
    .mockResolvedValue([{ name: 'España' }, { name: 'Francia' }]),
  getSummaryData: jest
    .fn()
    .mockResolvedValue([{ name: 'Madrid', tourists: 5000 }]),
  getTotalTouristsOfMunicipality: jest.fn(() => 5000),
}));

describe('Map component', () => {
  it('renderiza correctamente el mapa y los elementos básicos', async () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <Map />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(getByTestId('mock-map-view')).toBeTruthy();
      expect(getByText('SearchBar')).toBeTruthy();
    });
  });
});
