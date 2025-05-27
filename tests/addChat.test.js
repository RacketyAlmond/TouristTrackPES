import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AddChat from '../components/organisms/addChat';

// ✅ Mock de navegación sin requireActual
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
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

  return Promise.reject(new Error('Unknown fetch URL'));
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
    const { getByPlaceholderText } = render(<AddChat route={route} />);

    const input = getByPlaceholderText('Enter the ID of the user');
    fireEvent.changeText(input, 'nonexistent');
    fireEvent(input, 'submitEditing');

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'USER NOT FOUND',
        expect.stringContaining("The id doesn't belong to any user."),
        expect.any(Array),
        { cancelable: false },
      );
    });
  });
});
