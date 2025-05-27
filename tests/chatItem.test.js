// tests/ChatItem.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import ChatItem from '../components/atoms/chatItem.js'; // ajusta la ruta si es necesario
import { Image, Text } from 'react-native';

describe('Test component ChatItem que muestra avatar, nombre y mensaje opcional', () => {
  test('Given item con avatar, name y about corto then renderiza Image y mensaje completo', () => {
    // given
    const item = {
      avatar: 'https://example.com/avatar1.png',
      name: 'Usuario1',
      about: 'Hola mundo',
    };

    // when
    const tree = renderer.create(<ChatItem item={item} />);
    const image = tree.root.findByType(Image);
    const texts = tree.root.findAllByType(Text);

    // then
    expect(image.props.source).toEqual({ uri: item.avatar });
    expect(image.props.resizeMode).toBe('cover');

    // debe haber dos <Text>: nombre y mensaje
    expect(texts.length).toBe(2);
    // el primer Text es el nombre
    expect(texts[0].props.children).toBe(item.name);
    // el segundo Text es el mensaje sin truncar
    expect(texts[1].props.children).toBe(item.about);
  });

  test('Given item con about largo then trunca el mensaje a 28 caracteres + “...”', () => {
    // given
    const longAbout = 'A'.repeat(30); // 30 caracteres
    const item = {
      avatar: 'https://example.com/avatar2.png',
      name: 'Usuario2',
      about: longAbout,
    };

    // when
    const tree = renderer.create(<ChatItem item={item} />);
    const texts = tree.root.findAllByType(Text);

    // then
    // debe haber dos <Text>: nombre y mensaje truncado
    expect(texts.length).toBe(2);
    expect(texts[1].props.children).toBe(`${longAbout.slice(0, 28)}...`);
  });

  test('Given item con about vacío then solo renderiza el nombre', () => {
    // given
    const item = {
      avatar: 'https://example.com/avatar3.png',
      name: 'Usuario3',
      about: '',
    };

    // when
    const tree = renderer.create(<ChatItem item={item} />);
    const texts = tree.root.findAllByType(Text);
    const images = tree.root.findAllByType(Image);

    // then
    // siempre renderiza el avatar
    expect(images.length).toBe(1);
    // sólo un <Text> (el nombre)
    expect(texts.length).toBe(1);
    expect(texts[0].props.children).toBe(item.name);
  });

  test('Given item sin propiedad about then solo renderiza el nombre', () => {
    // given
    const item = {
      avatar: 'https://example.com/avatar4.png',
      name: 'Usuario4',
      // about undefined
    };

    // when
    const tree = renderer.create(<ChatItem item={item} />);
    const texts = tree.root.findAllByType(Text);

    // then
    expect(texts.length).toBe(1);
    expect(texts[0].props.children).toBe(item.name);
  });
});
