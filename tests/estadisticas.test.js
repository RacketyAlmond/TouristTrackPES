import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Estadisticas from '../components/organisms/estadisticas';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        header: 'Estadísticas',
        tourists: 'tourists',
        top: 'top',
      };
      return translations[key] || key;
    },
  }),
}));

// Simula el hook useRoute directamente
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: {
      locality: {
        name: 'Barcelona',
        comunidad: 'Cataluña',
        tourists: '100000',
      },
    },
  }),
  NavigationContainer: ({ children }) => children,
}));

// Mocks de funciones de lógica
jest.mock('../dataestur', () => ({
  getDataOfMunicipality: jest.fn(() =>
    Promise.resolve([
      {
        AÑO: '2021',
        MES: '01',
        TURISTAS: '1500',
        PAIS_RESIDENCIA: 'Italia',
      },
    ]),
  ),
  getTopCountries: jest.fn(() => ['Italia', 'Francia']),
  filterData: jest.fn(() => [
    {
      AÑO: '2021',
      MES: '01',
      TURISTAS: '1500',
      PAIS_RESIDENCIA: 'Italia',
    },
  ]),
  listYearsOfMunicipality: jest.fn(() => ['2021', '2020']),
  listOriginCountriesOfMunicipality: jest.fn(() => ['Italia', 'Francia']),
}));

jest.mock('../utils', () => ({
  getCountryFlag: (country) => `https://flags.com/${country}.png`,
}));

// Mockea componentes pesados
jest.mock(
  '../components/molecules/selectorPlataforma',
  () => 'SelectorPlataforma',
);
jest.mock('../components/molecules/grafica', () => 'Grafica');

describe('Estadisticas screen', () => {
  it('renders and displays basic data', async () => {
    const { getByText } = render(<Estadisticas />);

    await waitFor(() => {
      expect(getByText('Estadísticas')).toBeTruthy();
      expect(getByText('Barcelona')).toBeTruthy();
      expect(getByText('Cataluña')).toBeTruthy();
      expect(getByText('100000')).toBeTruthy();
    });
  });
});
