import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import InfoLocalidad from '../components/molecules/InfoLocalidad';
import { Alert } from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mocks
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    FontAwesome: (props) => <Text>{`FontAwesome ${props.name}`}</Text>,
    MaterialIcons: (props) => <Text>{`MaterialIcons ${props.name}`}</Text>,
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useFocusEffect: (cb) => cb(), // fuerza ejecución del efecto
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

global.fetch = jest.fn().mockImplementation((url) => {
  if (url.includes('ratings/location')) {
    return Promise.resolve({
      json: () => Promise.resolve({ averageStars: 4.5, totalRatings: 1000 }),
    });
  }
  return Promise.resolve({
    json: () => Promise.resolve({}),
  });
});

describe('⏱ InfoLocalidad - tiempo de respuesta', () => {
  it('renderiza correctamente en menos de 5 segundos', async () => {
    const start = performance.now();

    const { getByText } = render(
      <InfoLocalidad
        city='Barcelona'
        numTourists={12345}
        onClose={jest.fn()}
      />,
    );

    await waitFor(
      () => {
        // Asegura que los datos fueron cargados y renderizados
        expect(getByText('4.5')).toBeTruthy(); // Rating visible
      },
      { timeout: 5000 },
    );

    const end = performance.now();
    const duration = end - start;

    console.log(`⏱ Tiempo total: ${duration.toFixed(2)}ms`);

    expect(duration).toBeLessThan(5000);
  });
});
