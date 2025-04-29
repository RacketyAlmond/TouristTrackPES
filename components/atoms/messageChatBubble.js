/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageChatBubble = ({ message }) => {
  const { text, timestamp, isMe } = message;

  const time  = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  return (
    <View style={[styles.container, isMe ? styles.myMessageContainer : styles.theirMessageContainer]}>
      <View style={[styles.bubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>{text}</Text>
      </View>
      <Text style={styles.timestamp}>{time(timestamp)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 5,
    backgroundColor: '',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  bubble: {
    borderRadius: 18,
    padding: 12,
  },
  myMessage: {
    backgroundColor: '#572364',
  },
  theirMessage: {
    backgroundColor: 'gainsboro',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

export default MessageChatBubble;