// __tests__/InfoLocalidad.test.js

// 1) Mock vector icons
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import InfoLocalidad from '../components/molecules/InfoLocalidad.js'; // adjust path if needed
import { Text, View, TouchableOpacity } from 'react-native';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    FontAwesome: (props) => React.createElement('FontAwesome', props),
    MaterialIcons: (props) => React.createElement('MaterialIcons', props),
  };
});

// 2) Mock useNavigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('InfoLocalidad component', () => {
  const city = 'Barcelona';
  const numTourists = 12345;
  let onClose;
  let tree;

  beforeEach(() => {
    jest.clearAllMocks();
    onClose = jest.fn();
  });

  test('renders null when city is not provided', () => {
    const component = renderer.create(
      <InfoLocalidad city={null} numTourists={numTourists} onClose={onClose} />,
    );
    expect(component.toJSON()).toBeNull();
  });

  test('renders information correctly and handles close and navigation', () => {
    tree = renderer.create(
      <InfoLocalidad city={city} numTourists={numTourists} onClose={onClose} />,
    );
    const root = tree.root;

    // Title text
    const titleNode = root.findAllByType(Text)[0];
    expect(titleNode.props.children).toBe(city);

    // Comunidad text
    const comunidadNode = root.findAllByType(Text)[1];
    expect(comunidadNode.props.children).toBe('Comunidad');

    // Rating stars: 4 full, 1 half-empty
    const stars = root.findAllByType('FontAwesome');
    expect(stars.length).toBe(5);
    expect(stars[0].props.name).toBe('star');
    expect(stars[3].props.name).toBe('star');
    expect(stars[4].props.name).toBe('star-half-empty');

    // Rating text
    const ratingTextNode = root.findAllByType(Text)[2];
    // children is an array [4.5, ' (', 1000, ')']
    expect(ratingTextNode.props.children).toEqual([4.5, ' (', 1000, ')']);

    // Tourists info
    const touristsLine = root
      .findAllByType(Text)
      .find((n) => n.props.children === numTourists);
    expect(touristsLine).toBeDefined();

    // Expenses info
    // Gasto incluye número y símbolo '€'
    const expensesLine = root.findAllByType(Text).find((n) => {
      const c = n.props.children;
      return Array.isArray(c) && c[0] === 100 && c[1] === '€';
    });
    expect(expensesLine).toBeDefined();

    // Close button
    const buttons = root.findAllByType(TouchableOpacity);
    const closeButton = buttons[0]; // first TouchableOpacity is close
    act(() => closeButton.props.onPress());
    expect(onClose).toHaveBeenCalled();

    // Statistics button calls navigate
    const statsButton = root.findAllByType(TouchableOpacity).pop();
    act(() => statsButton.props.onPress());
    expect(mockNavigate).toHaveBeenCalledWith('Estadisticas', {
      locality: expect.objectContaining({ name: city }),
    });
  });
});
