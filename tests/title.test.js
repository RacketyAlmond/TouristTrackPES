// __tests__/Title.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import Title from '../components/atoms/title.js'; // ajusta la ruta si es distinta
import { Text } from 'react-native';
import { StyleSheet } from 'react-native';

describe('Test component Title que muestra un título con estilo', () => {
  test('Given title prop then renders Text with correct content and style', () => {
    // given
    const titleText = 'Mi Título';

    // when
    const tree = renderer.create(<Title title={titleText} />);
    const textNode = tree.root.findByType(Text);
    const style = StyleSheet.flatten(textNode.props.style);

    // then
    expect(textNode.props.children).toBe(titleText);
    expect(style.color).toBe('#572364');
    expect(style.fontSize).toBe(36);
    expect(style.fontWeight).toBe('bold');
  });
});
