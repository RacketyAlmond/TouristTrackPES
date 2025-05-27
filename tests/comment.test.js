// __tests__/Comment.test.js

// 1) Mocks antes de cualquier import real
// 2) Ahora sí importamos el resto
import React from 'react';
import renderer from 'react-test-renderer';
import Comment from '../components/atoms/comment.js'; // ajusta ruta si hace falta
import { Text } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale.cjs';

jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(),
}));
jest.mock('date-fns/locale.cjs', () => ({
  es: {}, // le damos un objeto vacío para que el import no falle
}));

describe('Test component Comment que muestra usuario, tiempo relativo y texto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given user, date y text then renderiza user, relativeTime y text', () => {
    // given
    const user = 'Alice';
    const date = '2025-05-20T10:00:00Z';
    const text = 'Este es un comentario';
    formatDistanceToNow.mockReturnValueOnce('hace 2 días');

    // when
    const tree = renderer.create(
      <Comment user={user} date={date} text={text} />,
    );
    const textNodes = tree.root.findAllByType(Text);

    // then
    expect(formatDistanceToNow).toHaveBeenCalledWith(new Date(date), {
      addSuffix: true,
      locale: es,
    });
    expect(textNodes.length).toBe(3);
    expect(textNodes[0].props.children).toBe(user);
    expect(textNodes[1].props.children).toBe('hace 2 días');
    expect(textNodes[2].props.children).toBe(text);
  });
});
