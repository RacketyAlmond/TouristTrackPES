// __tests__/TitleLocalidadForo.test.js

// 1) Mock de useNavigation antes de importar el componente
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import TitleLocalidadForo from '../components/atoms/titleLocalidadForo.js'; // ajusta la ruta si hace falta
import { Text, TouchableOpacity } from 'react-native';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Test component TitleLocalidadForo que muestra localidad y navega al foro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given LocName y forumId then renderiza el nombre y la flecha', () => {
    // given
    const props = { LocName: 'Barcelona', forumId: 'f123' };

    // when
    const tree = renderer.create(<TitleLocalidadForo {...props} />);
    const texts = tree.root.findAllByType(Text);

    // then
    // Debe haber dos textos: el nombre de la localidad y la flecha
    expect(texts.length).toBe(2);
    expect(texts[0].props.children).toBe('Barcelona');
    expect(texts[1].props.children).toBe('→');
  });

  test('Given presionar TouchableOpacity then llama a navigation.navigate con argumentos correctos', () => {
    // given
    const props = { LocName: 'Madrid', forumId: 'f456' };
    let tree;
    act(() => {
      tree = renderer.create(<TitleLocalidadForo {...props} />);
    });
    const button = tree.root.findByType(TouchableOpacity);

    // when
    act(() => {
      button.props.onPress();
    });

    // then
    expect(mockNavigate).toHaveBeenCalledWith('Forum', {
      localityName: 'Madrid',
      forumId: 'f456',
    });
  });
});
