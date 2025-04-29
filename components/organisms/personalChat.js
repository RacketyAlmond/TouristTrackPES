/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import ChatHeader from '../molecules/chatHeader';
import MessageChatList from '../molecules/messageChatList.js';
import MessageChatInput from '../atoms/messageChatInput';
import ChatJson from '../../json/chat.json';


const PersonalChat = ({ route, navigation, User }) => {
  const userData = route.params.User;
  console.log(userData);
  const currentUser = route.params.currentUser;
  const currentSession = currentUser.id;
  const idCurrentSession = currentSession;
  const chatData = ChatJson.filter(msg => 
    (msg.sendBy === idCurrentSession && msg.sendTo === userData.id) || 
    (msg.sendBy === userData.id && msg.sendTo === idCurrentSession)
  );

  const chatMessages = chatData.map(txt => ({
    id: txt.id.toString(),
    text: txt.content,
    timestamp: txt.timestamp,
    isMe: txt.sendBy === currentSession,
  }));
  
  const [messages, setMessages] = useState(chatMessages);

  const handleSendMessage = (text) => {
    if (text.trim().length === 0) return;
    
    const messageId = Date.now().toString();
    
    const newMessage = {
      id: messageId,
      text: text,
      timestamp: new Date().toISOString(),
      isMe: true,
    };
    
    setMessages([...messages, newMessage]);
    
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader 
        contactName={userData.name} 
        contactAvatar={userData.avatar}
        contactDescription={userData.about}
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
    backgroundColor: 'white',
    paddingTop:
          Platform.OS === 'android'
            ? Math.min(StatusBar.currentHeight || 30, 30)
            : 0,
  },
});

export default PersonalChat;