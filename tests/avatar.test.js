// __tests__/Avatar.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import Avatar from '../components/atoms/avatar.js'; // ajusta la ruta si hace falta
import { Image } from 'react-native';

describe('Test component Avatar que renderiza un Image según prop avatar', () => {
  test('Given avatar URL then renders Image with correct source', () => {
    // given
    const avatarUrl = 'https://example.com/avatar.png';

    // when
    const tree = renderer.create(<Avatar avatar={avatarUrl} />);
    const image = tree.root.findByType(Image);

    // then
    expect(image).toBeDefined();
    expect(image.props.source).toEqual({ uri: avatarUrl });
  });

  test('Given null avatar then does not render Image', () => {
    // given
    const tree = renderer.create(<Avatar avatar={null} />);

    // when
    const images = tree.root.findAllByType(Image);

    // then
    expect(images.length).toBe(0);
  });

  test('Given undefined avatar then does not render Image', () => {
    // given
    const tree = renderer.create(<Avatar />);

    // when
    const images = tree.root.findAllByType(Image);

    // then
    expect(images.length).toBe(0);
  });
});
