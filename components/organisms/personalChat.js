/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ChatHeader from '../molecules/chatHeader';
import MessageChatList from '../molecules/messageChatList.js';
import MessageChatInput from '../atoms/messageChatInput';

// Datos de ejemplo para el chat
const MOCK_CHAT = {
  chatId: '1',
  contactName: 'Steve',
  contactAvatar: 'https://www.slashfilm.com/img/gallery/who-plays-alex-in-a-minecraft-movie/intro-1744039987.jpg',
  messages: [
    {
      id: '1',
      text: 'I... Am Steve',
      timestamp: '2025-04-12T10:30:00.000Z',
      isMe: false,
    },
    {
      id: '2',
      text: 'Flint and Steel',
      timestamp: '2025-04-12T10:32:00.000Z',
      isMe: true,
    },
    {
      id: '3',
      text: 'Chicken Jockey',
      timestamp: '2025-04-13T10:33:00.000Z',
      isMe: false,
    },
    {
      id: '4',
      text: 'When I was a child, I yerned for the mines',
      timestamp: '2025-04-14T10:35:00.000Z',
      isMe: true,
    },
  ],
};

const PersonalChat = ({ route, navigation }) => {
  const [chatData, setChatData] = useState(MOCK_CHAT);
  const [messages, setMessages] = useState(MOCK_CHAT.messages);

  const handleSendMessage = (text) => {
    if (text.trim().length === 0) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: text,
      timestamp: new Date().toISOString(),
      isMe: true,
    };
    
    setMessages([...messages, newMessage]);
  };

  //Retroceder --> no disponible en este momento
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSpace} />
      <ChatHeader 
        contactName={chatData.contactName} 
        contactAvatar={chatData.contactAvatar}
        onBackPress={goBack}
      />
      <MessageChatList messages={messages} />
      <MessageChatInput onSendMessage={handleSendMessage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerSpace: {
    height: 40,
  },
});

export default PersonalChat;