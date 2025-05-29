import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import SelectorPlataforma from '../components/molecules/selectorPlataforma';

jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const Picker = ({ selectedValue }) => (
    <Text>{`Selected: ${selectedValue}`}</Text>
  );
  Picker.Item = ({ label }) => <Text>{label}</Text>;
  return { Picker };
});

describe('SelectorPlataforma component', () => {
  const options = ['One', 'Two', 'Three'];
  const onValueChange = jest.fn();
  const style = { padding: 5 };

  let originalPlatformOS;

  beforeAll(() => {
    // Guardamos el valor original de Platform.OS
    originalPlatformOS = Platform.OS;
  });

  afterAll(() => {
    // Restauramos Platform.OS
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalPlatformOS,
    });
  });

  it('renders Android Picker with items', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'android',
    });

    const { getByText } = render(
      <SelectorPlataforma
        selectedValue='Two'
        onValueChange={onValueChange}
        options={options}
        style={style}
      />,
    );

    expect(getByText('Selected: Two')).toBeTruthy();
  });

  it('renders iOS modal and allows selecting an item', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'ios',
    });

    const { getByText } = render(
      <SelectorPlataforma
        selectedValue='One'
        onValueChange={onValueChange}
        options={options}
        style={style}
      />,
    );

    fireEvent.press(getByText('One')); // abre modal
    fireEvent.press(getByText('Two')); // selecciona nueva opción

    expect(onValueChange).toHaveBeenCalledWith('Two');
  });
});
