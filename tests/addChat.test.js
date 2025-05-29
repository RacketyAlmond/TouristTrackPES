import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AddChat from '../components/organisms/addChat';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../firebaseConfig.js', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
      name: 'Test User',
    },
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('../json/userApp.json', () => [
  {
    id: 'user1',
    name: 'User One',
    about: 'About user one',
    avatar: 'https://example.com/avatar1.png',
  },
]);

global.fetch = jest.fn((url) => {
  if (url.includes('received')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 'user2',
            firstName: 'User Two',
            about: 'About user two',
            avatar: 'https://example.com/avatar2.png',
          },
        ]),
    });
  }

  if (url.includes('sent')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  }

  // Añade este caso para evitar el error de URL desconocida
  if (url.includes('users')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  }

  // Por si acaso: devuélvelo vacío por defecto
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  });
});

describe('AddChat component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  const route = {
    params: {
      currentUser: { id: 'currentUser' },
      dataJson: [],
    },
  };

  it('shows alert when searching for a user that does not exist', async () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <AddChat route={route} />
      </NavigationContainer>,
    );

    const input = getByPlaceholderText('create'); // Usa el placeholder correcto según el render
    fireEvent.changeText(input, 'nonexistent');
    fireEvent(input, 'submitEditing');

    await waitFor(() => {
      const alertCalls = Alert.alert.mock.calls;

      const userNotFoundAlertExists = alertCalls.some(
        ([title, message]) =>
          title === 'not-found' && message.includes('not-found-text'),
      );

      expect(userNotFoundAlertExists).toBe(true);
    });
  });
});
