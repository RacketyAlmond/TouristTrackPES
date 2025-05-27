// __tests__/AuthScreen.test.js

// 1) Mock the background image import
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import AuthScreen from '../components/molecules/auth.js'; // adjust path if needed
import { Text, TextInput, TouchableOpacity } from 'react-native';

jest.mock('../public/mapa.png', () => 1);

// 2) Mock useAuth before importing the component
const mockSignUp = jest.fn();
const mockSignIn = jest.fn();
jest.mock('../components/atoms/AuthContext.js', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
    signIn: mockSignIn,
  }),
}));

describe('AuthScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given signUp mode then pressing send calls signUp and onAuthenticated(true)', async () => {
    // given
    const fakeUser = { uid: 'u1' };
    mockSignUp.mockResolvedValueOnce(fakeUser);
    const onAuthenticated = jest.fn();
    let tree;
    await act(async () => {
      tree = renderer.create(<AuthScreen onAuthenticated={onAuthenticated} />);
    });

    const [emailInput, passwordInput] = tree.root.findAllByType(TextInput);
    const sendButton = tree.root.findAllByType(TouchableOpacity)[0];

    // when
    act(() => emailInput.props.onChangeText('test@example.com'));
    act(() => passwordInput.props.onChangeText('secret'));
    await act(async () => sendButton.props.onPress());

    // then
    expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'secret');
    expect(onAuthenticated).toHaveBeenCalledWith(fakeUser, true);
  });

  test('Given signIn mode then pressing send calls signIn and onAuthenticated(false)', async () => {
    // given
    const fakeUser = { uid: 'u2' };
    mockSignIn.mockResolvedValueOnce(fakeUser);
    const onAuthenticated = jest.fn();
    let tree;
    await act(async () => {
      tree = renderer.create(<AuthScreen onAuthenticated={onAuthenticated} />);
    });

    // toggle to Sign In
    const [, toggleButton] = tree.root.findAllByType(TouchableOpacity);
    act(() => toggleButton.props.onPress());

    // verify title switched
    const titleText = tree.root.findAllByType(Text)[0].props.children;
    expect(titleText).toBe('Sign In');

    const [emailInput, passwordInput] = tree.root.findAllByType(TextInput);
    const sendButton = tree.root.findAllByType(TouchableOpacity)[0];

    // when
    act(() => emailInput.props.onChangeText('user@ex.com'));
    act(() => passwordInput.props.onChangeText('pwd'));
    await act(async () => sendButton.props.onPress());

    // then
    expect(mockSignIn).toHaveBeenCalledWith('user@ex.com', 'pwd');
    expect(onAuthenticated).toHaveBeenCalledWith(fakeUser, false);
  });

  test('Given signUp throws error then it displays the error message', async () => {
    // given
    const error = new Error('Failure');
    mockSignUp.mockRejectedValueOnce(error);
    const onAuthenticated = jest.fn();
    let tree;
    await act(async () => {
      tree = renderer.create(<AuthScreen onAuthenticated={onAuthenticated} />);
    });

    const [emailInput, passwordInput] = tree.root.findAllByType(TextInput);
    const sendButton = tree.root.findAllByType(TouchableOpacity)[0];

    act(() => emailInput.props.onChangeText('x@x'));
    act(() => passwordInput.props.onChangeText('y'));

    // when
    await act(async () => sendButton.props.onPress());

    // then
    const texts = tree.root.findAllByType(Text);
    // index 1 is error (index 0 is the title)
    expect(texts[1].props.children).toBe('Failure');
    expect(onAuthenticated).not.toHaveBeenCalled();
  });
});
