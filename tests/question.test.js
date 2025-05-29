// __tests__/Question.test.js

// 1) Mocks antes de cualquier import real
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Question from '../components/atoms/question.js'; // ajusta la ruta si hiciera falta
import { TouchableOpacity, Text, TextInput } from 'react-native';
import { formatDistanceToNow } from 'date-fns';

jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(),
}));
jest.mock('date-fns/locale', () => ({
  es: {},
}));
// Stub del componente Comment para evitar dependencias externas
jest.mock('../components/atoms/comment', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ user, date, text }) =>
      React.createElement('Comment', { user, date, text }),
  };
});

jest.mock('../firebaseConfig.js', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
      name: 'Test User',
    },
  },
}));

jest.mock('../components/atoms/UserContext', () => ({
  useUser: () => ({
    userData: { firstName: 'TestUser' /* otras propiedades si usas */ },
    getUserData: jest.fn(),
  }),
}));

describe('Test component Question que carga respuestas y gestiona toggles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Controlamos la hora relativa
    formatDistanceToNow.mockReturnValue('hace poco');
    // Mock global.fetch
    global.fetch = jest.fn();
  });

  test('Given mount then fetch answers y user info; el toggle muestra el número de respuestas', async () => {
    // given
    const props = {
      forumId: 'f1',
      questionId: 'q1',
      userId: 'u0',
      user: 'Alice',
      date: '2025-05-20T10:00:00Z',
      text: 'Texto de la pregunta',
    };
    // 1ª llamada: GET a respuestas
    const fakeRespuestas = [
      { id: 'a1', Author: 'u1', text: 'Respuesta1', date: { _seconds: 1000 } },
      { id: 'a2', Author: 'u2', text: 'Respuesta2', date: { _seconds: 2000 } },
    ];
    global.fetch
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({ success: true, respuestas: fakeRespuestas }),
      })
      // 2ª llamada: GET a /users/u1
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            usuario: { firstName: 'Bob', userLocation: 'UK' },
          }),
      })
      // 3ª llamada: GET a /users/u2
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            usuario: { firstName: 'Carol', userLocation: 'US' },
          }),
      });

    let tree;
    // when
    await act(async () => {
      tree = renderer.create(<Question {...props} />);
    });

    // then
    // Botón de respuestas es el primer TouchableOpacity
    const buttons = tree.root.findAllByType(TouchableOpacity);
    const answersToggle = buttons[0];
    const toggleText = answersToggle.findByType(Text).props.children;
    expect(toggleText).toBe('2 answers');
  });

  test('Given toggle showAnswers then renderiza los componentes Comment correspondientes', async () => {
    // given: misma configuración de fetch que antes
    const props = {
      forumId: 'f1',
      questionId: 'q1',
      userId: 'u0',
      user: 'Alice',
      date: '2025-05-20T10:00:00Z',
      text: 'Pregunta',
    };
    const fakeRespuestas = [
      { id: 'a1', Author: 'u1', text: 'R1', date: { _seconds: 1000 } },
    ];
    global.fetch
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({ success: true, respuestas: fakeRespuestas }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            usuario: { firstName: 'Bob', userLocation: 'UK' },
          }),
      });

    let tree;
    await act(async () => {
      tree = renderer.create(<Question {...props} />);
    });

    // when: presionamos el botón de respuestas
    const answersToggle = tree.root.findAllByType(TouchableOpacity)[0];
    act(() => {
      answersToggle.props.onPress();
    });

    // then: debe aparecer un <Comment> por cada respuesta
    const commentNodes = tree.root.findAllByType('Comment');
    expect(commentNodes.length).toBe(1);
  });

  test('Given toggle showNewAnswer then renderiza el TextInput para nueva respuesta', async () => {
    // given: mount sin respuestas
    const props = {
      forumId: 'f1',
      questionId: 'q1',
      userId: 'u0',
      user: 'Alice',
      date: '2025-05-20T10:00:00Z',
      text: 'Pregunta',
    };
    // respuestas vacías
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true, respuestas: [] }),
    });

    let tree;
    await act(async () => {
      tree = renderer.create(<Question {...props} />);
    });

    // when: presionamos el segundo TouchableOpacity (Responder)
    const newAnswerToggle = tree.root.findAllByType(TouchableOpacity)[1];
    act(() => {
      newAnswerToggle.props.onPress();
    });

    // then: debe aparecer un TextInput
    const input = tree.root.findByType(TextInput);
    expect(input).toBeDefined();
  });
});
