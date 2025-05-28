// __tests__/InfoLocalidad.test.js

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import InfoLocalidad from '../components/molecules/InfoLocalidad.js'; // adjust path if needed
import { Text, TouchableOpacity } from 'react-native';

// 1) Mock vector icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    FontAwesome: (props) => React.createElement('FontAwesome', props),
    MaterialIcons: (props) => React.createElement('MaterialIcons', props),
  };
});

// 2) Mock useNavigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({ navigate: mockNavigate }),
    useFocusEffect: jest.fn((cb) => cb()), // simulate effect running
  };
});

let onClose;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  onClose = jest.fn();

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ averageStars: 4.5, totalRatings: 1000 }),
    }),
  );
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('InfoLocalidad component', () => {
  const city = 'Barcelona';
  const numTourists = 12345;

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
});
