// // __tests__/MessageChatList.test.js

// 1) Mock child components
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import MessageChatList from '../components/molecules/messageChatList.js';
import { FlatList } from 'react-native';

jest.mock('../components/atoms/messageChatData', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ date }) => React.createElement('MessageChatDataMock', { date }),
  };
});
jest.mock('../components/atoms/messageChatBubble', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ message }) =>
      React.createElement('MessageChatBubbleMock', { message }),
  };
});

describe('MessageChatList component', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2025-05-23T12:00:00Z'));
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  const now = new Date('2025-05-23T12:00:00Z');
  const yesterday = new Date('2025-05-22T09:00:00Z');
  const older = new Date('2025-05-20T08:00:00Z');

  const messages = [
    { id: '1', timestamp: now.toISOString(), text: 'Hi', isMe: true },
    { id: '2', timestamp: now.toISOString(), text: 'Hello', isMe: false },
    { id: '3', timestamp: yesterday.toISOString(), text: 'Y', isMe: true },
    { id: '4', timestamp: older.toISOString(), text: 'Old', isMe: false },
  ];

  let tree;
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      tree = renderer.create(<MessageChatList messages={messages} />);
    });
  });

  test('groups messages into 3 dates and renders correct headers', () => {
    // FlatList data length
    const flatList = tree.root.findByType(FlatList);
    expect(flatList.props.data.length).toBe(3);

    // Three MessageChatDataMock with correct date props
    const headers = tree.root.findAllByType('MessageChatDataMock');
    expect(headers.length).toBe(3);
    expect(headers[0].props.date).toBe('TODAY');
    expect(headers[1].props.date).toBe('YESTERDAY');
    expect(headers[2].props.date).toBe('TUESDAY, MAY 20');
  });

  test('renders one bubble per message in order', () => {
    const bubbles = tree.root.findAllByType('MessageChatBubbleMock');
    expect(bubbles.length).toBe(4);
    // verify first and last message props
    expect(bubbles[0].props.message.id).toBe('1');
    expect(bubbles[3].props.message.id).toBe('4');
  });
});
