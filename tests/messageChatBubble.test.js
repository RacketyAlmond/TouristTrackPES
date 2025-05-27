// __tests__/MessageChatBubble.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import MessageChatBubble from '../components/atoms/messageChatBubble.js'; // ajusta la ruta si hace falta
import { Text, View, StyleSheet } from 'react-native';

describe('Test component MessageChatBubble que muestra mensaje y timestamp con estilos según isMe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given isMe true then container y burbuja usan estilos de “myMessage” y muestra texto y hora', () => {
    // dado: stub de toLocaleTimeString para controlar salida
    const fakeTime = '14:05';
    jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue(fakeTime);

    const message = {
      text: 'Hola, soy yo',
      timestamp: '2025-05-23T12:05:00Z',
      isMe: true,
    };

    // cuando
    const tree = renderer.create(<MessageChatBubble message={message} />);
    const rootView = tree.root.findByType(View);

    // entonces: el contenedor principal debe alinearse a la derecha
    const containerStyle = StyleSheet.flatten(rootView.props.style);
    expect(containerStyle.alignSelf).toBe('flex-end');

    // la burbuja debe tener fondo morado (#572364)
    const bubbleView = tree.root.findAllByType(View)[1];
    const bubbleStyle = StyleSheet.flatten(bubbleView.props.style);
    expect(bubbleStyle.backgroundColor).toBe('#572364');

    // debe mostrar el texto del mensaje y el timestamp stubbed
    const texts = tree.root.findAllByType(Text);
    expect(texts[0].props.children).toBe(message.text);
    expect(texts[1].props.children).toBe(fakeTime);
  });

  test('Given isMe false then usa estilos de “theirMessage” y muestra texto y hora', () => {
    // dado: stub de toLocaleTimeString
    const fakeTime = '09:30';
    jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue(fakeTime);

    const message = {
      text: 'Hola, soy otro',
      timestamp: '2025-05-23T07:30:00Z',
      isMe: false,
    };

    // cuando
    const tree = renderer.create(<MessageChatBubble message={message} />);
    const rootView = tree.root.findByType(View);

    // entonces: el contenedor principal debe alinearse a la izquierda
    const containerStyle = StyleSheet.flatten(rootView.props.style);
    expect(containerStyle.alignSelf).toBe('flex-start');

    // la burbuja debe tener fondo gris (gainsboro)
    const bubbleView = tree.root.findAllByType(View)[1];
    const bubbleStyle = StyleSheet.flatten(bubbleView.props.style);
    expect(bubbleStyle.backgroundColor).toBe('gainsboro');

    // debe mostrar el texto del mensaje y el timestamp stubbed
    const texts = tree.root.findAllByType(Text);
    expect(texts[0].props.children).toBe(message.text);
    expect(texts[1].props.children).toBe(fakeTime);
  });
});
