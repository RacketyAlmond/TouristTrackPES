/**
 * @jest-environment jsdom
 */
// __tests__/PersonalChat.test.js

// --- Mocks antes de cualquier import ---
// --- Imports después de los mocks ---
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import PersonalChat from '../components/organisms/personalChat.js';

jest.mock('../components/molecules/chatHeader.js', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ onBackPress }) =>
      React.createElement('ChatHeaderMock', { onBackPress }),
  };
});
jest.mock('../components/molecules/messageChatList.js', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ messages }) =>
      React.createElement('MessageChatListMock', { messages }),
  };
});
jest.mock('../components/atoms/messageChatInput.js', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ onSendMessage }) =>
      React.createElement('MessageChatInputMock', { onSendMessage }),
  };
});
const { Alert } = require('react-native');
jest.spyOn(Alert, 'alert').mockImplementation(() => {});
global.fetch = jest.fn();

describe('PersonalChat component', () => {
  const route = {
    params: {
      User: { id: 'u2', name: 'Bob', avatar: 'a', about: 'hi' },
      currentUser: { id: 'u1' },
      state: 0,
    },
  };
  const navigation = { goBack: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchMessages carga mensajes al montar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            content: 'hello',
            timestamp: { _seconds: 1000 },
            sentByID: 'u1',
          },
        ]),
    });

    let tree;
    await act(async () => {
      tree = renderer.create(
        <PersonalChat route={route} navigation={navigation} />,
      );
    });

    const list = tree.root.findByType('MessageChatListMock');
    expect(list.props.messages).toHaveLength(1);

    expect(fetch).toHaveBeenCalled();
  });

  it('handleSendMessage añade mensaje y hace POST', async () => {
    // primer GET vacío
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });

    let tree;
    await act(async () => {
      tree = renderer.create(
        <PersonalChat route={route} navigation={navigation} />,
      );
    });

    const inputMock = tree.root.findByType('MessageChatInputMock');
    const onSend = inputMock.props.onSendMessage;

    fetch.mockResolvedValueOnce({ ok: true });
    await act(async () => onSend('New message'));

    const list = tree.root.findByType('MessageChatListMock');
    expect(list.props.messages).toHaveLength(1);

    expect(fetch.mock.calls[1][0]).toBe(
      '***REMOVED***/messages',
    );
    expect(fetch.mock.calls[1][1].method).toBe('POST');
  });

  it('onBackPress llama a navigation.goBack', () => {
    const tree = renderer.create(
      <PersonalChat route={route} navigation={navigation} />,
    );
    const header = tree.root.findByType('ChatHeaderMock');
    act(() => header.props.onBackPress());
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
