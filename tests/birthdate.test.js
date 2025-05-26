// __tests__/BirthdateScreen.test.js

// 1) Stub the background image import
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import BirthdateScreen from '../components/molecules/birthdate.js'; // ajusta si tu ruta difiere
import { TextInput, TouchableOpacity } from 'react-native';

jest.mock('../public/mapa.png', () => 1);

// 2) Stub useUser.createUserData before importing the component
const mockCreateUserData = jest.fn();
jest.mock('../components/atoms/UserContext.js', () => ({
  useUser: () => ({
    createUserData: mockCreateUserData,
  }),
}));

// 3) Stub the native datetime picker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  return (props) => React.createElement('DateTimePicker', props);
});

describe('BirthdateScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given tap on date opens the DateTimePicker', () => {
    // given
    let tree;
    act(() => {
      tree = renderer.create(<BirthdateScreen onComplete={jest.fn()} />);
    });
    // initially no picker
    expect(tree.root.findAllByType('DateTimePicker').length).toBe(0);

    // when: press the date TouchableOpacity
    const dateButton =
      tree.root.findAllByType(TouchableOpacity).find((btn) => {
        // the first Touchable is the date button
        return (
          btn.props.onPress &&
          btn.props.children &&
          typeof btn.props.children !== 'string'
        );
      }) || tree.root.findAllByType(TouchableOpacity)[0];
    act(() => dateButton.props.onPress());

    // then: the DateTimePicker stub appears
    expect(tree.root.findAllByType('DateTimePicker').length).toBe(1);
  });

  test('Given valid inputs then pressing Save Data calls createUserData and onComplete', async () => {
    // given
    const onComplete = jest.fn();
    let tree;
    await act(async () => {
      tree = renderer.create(<BirthdateScreen onComplete={onComplete} />);
    });
    const inputs = tree.root.findAllByType(TextInput);
    const fnameInput = inputs[0];
    const locationInput = inputs[1];
    const saveButton = tree.root.findAllByType(TouchableOpacity).pop(); // last TouchableOpacity is the Save Data button

    // when: fill in the fields
    act(() => fnameInput.props.onChangeText('Alice'));
    act(() => locationInput.props.onChangeText('Wonderland'));
    await act(async () => {
      saveButton.props.onPress();
    });

    // then
    expect(mockCreateUserData).toHaveBeenCalledTimes(1);
    // We cannot predict the exact date string, so assert on each argument type
    const args = mockCreateUserData.mock.calls[0];
    expect(args[0]).toBe('Alice'); // fname
    expect(typeof args[1]).toBe('string'); // birthdate.toDateString()
    expect(args[2]).toBe('Wonderland'); // userLocation
    expect(args[3]).toBe("Hi! I'm using TouristTrack"); // about
    expect(typeof args[4]).toBe('object'); // points ref
    expect(onComplete).toHaveBeenCalled();
  });
});
