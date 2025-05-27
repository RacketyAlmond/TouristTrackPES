// __tests__/ChatHeader.test.js

// 1) Mock Ionicons before importing the component
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ChatHeader from '../components/molecules/chatHeader.js'; // ajusta la ruta si hiciera falta
import { Text, Image, TouchableOpacity } from 'react-native';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props) => React.createElement('Ionicons', props),
  };
});

describe('ChatHeader component que muestra avatar, nombre, descripción y botón de retroceso', () => {
  let onBackPress;
  const props = {
    contactName: 'John Doe',
    contactAvatar: 'https://example.com/john.png',
    contactDescription: 'En línea',
    onBackPress: () => {},
  };

  beforeEach(() => {
    onBackPress = jest.fn();
    props.onBackPress = onBackPress;
    jest.clearAllMocks();
  });

  test('Given props then renderiza avatar, nombre y descripción correctamente', () => {
    // given
    const { contactName, contactAvatar, contactDescription } = props;

    // when
    const tree = renderer.create(<ChatHeader {...props} />);
    const texts = tree.root.findAllByType(Text);
    const image = tree.root.findByType(Image);

    // then
    // Debe haber dos <Text>: nombre y descripción
    expect(texts.length).toBe(2);
    expect(texts[0].props.children).toBe(contactName);
    expect(texts[1].props.children).toBe(contactDescription);
    // El <Image> debe recibir la URL correcta
    expect(image.props.source).toEqual({ uri: contactAvatar });
  });

  test('Given pulsar el botón de retroceso then llama a onBackPress', () => {
    // given
    const tree = renderer.create(<ChatHeader {...props} />);
    const backButton = tree.root.findByType(TouchableOpacity);

    // when
    act(() => backButton.props.onPress());

    // then
    expect(onBackPress).toHaveBeenCalled();
  });
});
