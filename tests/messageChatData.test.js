// __tests__/MessageChatData.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import MessageChatData from '../components/atoms/messageChatData.js'; // ajusta la ruta si es distinto
import { View, Text, StyleSheet } from 'react-native';

describe('Test component MessageChatData que muestra fecha con líneas a los lados', () => {
  test('Given date then renders two lines and the date text', () => {
    // given
    const date = '23 May 2025';

    // when
    const tree = renderer.create(<MessageChatData date={date} />);
    const views = tree.root.findAllByType(View);
    const textNode = tree.root.findByType(Text);

    // then
    // Debe haber 3 Views: container + 2 líneas
    expect(views.length).toBe(3);

    // El Text debe mostrar exactamente la fecha pasada
    expect(textNode.props.children).toBe(date);

    // Las dos Views de línea deben tener altura 1 y backgroundColor '#E0E0E0'
    const lineViews = views.filter((v) => {
      const style = StyleSheet.flatten(v.props.style);
      return style.height === 1 && style.backgroundColor === '#E0E0E0';
    });
    expect(lineViews.length).toBe(2);
  });

  test('Given date then container has correct styling', () => {
    // given
    const date = 'Any date';

    // when
    const tree = renderer.create(<MessageChatData date={date} />);
    const container = tree.root.findByType(View);
    const style = StyleSheet.flatten(container.props.style);

    // then
    expect(style.flexDirection).toBe('row');
    expect(style.alignItems).toBe('center');
    expect(style.marginVertical).toBe(10);
    expect(style.paddingHorizontal).toBe(16);
  });
});
