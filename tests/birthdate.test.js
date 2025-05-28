// __tests__/BirthdateScreen.test.js

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import BirthdateScreen from '../components/molecules/birthdate.js'; // ajusta si tu ruta difiere
import { TextInput, TouchableOpacity, Text } from 'react-native';
import { auth } from '../firebaseConfig.js';

jest.mock('../public/mapa.png', () => 1);

const mockCreateUserData = jest.fn();
jest.mock('../components/atoms/UserContext.js', () => ({
  useUser: () => ({
    createUserData: mockCreateUserData,
  }),
}));

jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  return (props) => React.createElement('DateTimePicker', props);
});

describe('BirthdateScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock auth.currentUser para que no falle en handleSend
    auth.currentUser = { uid: 'test-user-id' };
  });

  test('Given tap on date opens the DateTimePicker', () => {
    let tree;
    act(() => {
      tree = renderer.create(<BirthdateScreen onComplete={jest.fn()} />);
    });

    expect(tree.root.findAllByType('DateTimePicker').length).toBe(0);

    const dateButton =
      tree.root.findAllByType(TouchableOpacity).find((btn) => {
        return (
          btn.props.onPress &&
          btn.props.children &&
          typeof btn.props.children !== 'string'
        );
      }) || tree.root.findAllByType(TouchableOpacity)[0];

    act(() => dateButton.props.onPress());

    expect(tree.root.findAllByType('DateTimePicker').length).toBe(1);
  });

  test('Given valid inputs then pressing Save Data calls createUserData and onComplete', async () => {
    const onComplete = jest.fn();
    let tree;

    await act(async () => {
      tree = renderer.create(<BirthdateScreen onComplete={onComplete} />);
    });

    const inputs = tree.root.findAllByType(TextInput);
    const fnameInput = inputs[0];
    const locationInput = inputs[1];

    act(() => {
      fnameInput.props.onChangeText('Alice');
      locationInput.props.onChangeText('Wonderland');
    });

    // Buscar el botón Save Data por su texto para asegurar que esté visible
    const saveButton = tree.root.findAllByType(TouchableOpacity).find((btn) => {
      try {
        const textChild = btn.findAllByType(Text)[0];
        return textChild && textChild.props.children === 'Save Data';
      } catch {
        return false;
      }
    });

    expect(saveButton).toBeDefined();

    await act(async () => {
      saveButton.props.onPress();
    });

    expect(mockCreateUserData).toHaveBeenCalledTimes(1);

    const args = mockCreateUserData.mock.calls[0];
    expect(args[0]).toBe('Alice'); // fname
    expect(typeof args[1]).toBe('string'); // birthdate.toDateString()
    expect(args[2]).toBe('Wonderland'); // userLocation
    expect(args[3]).toBe("Hi! I'm using TouristTrack"); // about
    expect(typeof args[4]).toBe('object'); // points ref

    expect(onComplete).toHaveBeenCalled();
  });
});
