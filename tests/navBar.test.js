import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NavBar from '../components/organisms/navBar';
import { TouchableOpacity } from 'react-native';

// Mock de navegación
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock imágenes
jest.mock('../public/map.png', () => 1);
jest.mock('../public/forum.png', () => 2);
jest.mock('../public/chat.png', () => 3);
jest.mock('../public/user.png', () => 4);

// MOCK de auth.currentUser para que exista en el test
jest.mock('../firebaseConfig.js', () => ({
  auth: {
    currentUser: { uid: 'test-uid' }, // simula usuario logueado
  },
}));

describe('NavBar component', () => {
  it('renderiza correctamente los botones de navegación', () => {
    const { UNSAFE_getAllByType } = render(<NavBar />);
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    expect(buttons).toHaveLength(4);
  });

  it('navega correctamente al pulsar los botones', () => {
    const { UNSAFE_getAllByType } = render(<NavBar />);
    const [mapBtn, forumBtn, chatBtn, userBtn] =
      UNSAFE_getAllByType(TouchableOpacity);

    fireEvent.press(mapBtn);
    expect(mockNavigate).toHaveBeenCalledWith('Mapa');
    mockNavigate.mockClear();

    fireEvent.press(forumBtn);
    expect(mockNavigate).toHaveBeenCalledWith('Foros');
    mockNavigate.mockClear();

    fireEvent.press(chatBtn);
    expect(mockNavigate).toHaveBeenCalledWith('Chats');
    mockNavigate.mockClear();

    fireEvent.press(userBtn);
    expect(mockNavigate).toHaveBeenCalledWith('User');
  });
});
