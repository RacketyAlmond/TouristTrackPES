// __tests__/MessageChatInput.test.js

// 1) Mock de @expo/vector-icons para que Ionicons sea un stub
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MessageChatInput from '../components/atoms/messageChatInput.js'; // ajusta la ruta si hace falta
import { TextInput, TouchableOpacity } from 'react-native';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props) => React.createElement('Ionicons', props),
  };
});

describe('Test component MessageChatInput que gestiona la entrada de texto y envía mensajes', () => {
  test('Given no message then pressing send does not call onSendMessage', () => {
    // given
    const mockOnSend = jest.fn();
    let tree;
    act(() => {
      tree = renderer.create(<MessageChatInput onSendMessage={mockOnSend} />);
    });
    const sendButton = tree.root.findByType(TouchableOpacity);

    // when
    act(() => {
      sendButton.props.onPress();
    });

    // then
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  test('Given typing a message then input value updates accordingly', () => {
    // given
    const mockOnSend = jest.fn();
    let tree;
    act(() => {
      tree = renderer.create(<MessageChatInput onSendMessage={mockOnSend} />);
    });
    const input = tree.root.findByType(TextInput);

    // when
    act(() => {
      input.props.onChangeText('Hola mundo');
    });

    // then
    expect(input.props.value).toBe('Hola mundo');
  });

  test('Given non-empty message then pressing send calls onSendMessage and clears input', () => {
    // given
    const mockOnSend = jest.fn();
    let tree;
    act(() => {
      tree = renderer.create(<MessageChatInput onSendMessage={mockOnSend} />);
    });
    const input = tree.root.findByType(TextInput);
    const sendButton = tree.root.findByType(TouchableOpacity);

    act(() => {
      input.props.onChangeText('¡Mensaje!');
    });

    // when
    act(() => {
      sendButton.props.onPress();
    });

    // then
    expect(mockOnSend).toHaveBeenCalledWith('¡Mensaje!');
    expect(input.props.value).toBe('');
  });
});
