/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import ChatHeader from '../molecules/chatHeader';
import MessageChatList from '../molecules/messageChatList.js';
import MessageChatInput from '../atoms/messageChatInput';



const PersonalChat = ({ route, navigation }) => {
  const userData = route.params.User;
  const currentUser = route.params.currentUser;
  const idCurrentSession = currentUser.id;
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://ip_personal_con_puerto/messages/between/${idCurrentSession}/${userData.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      const formattedMessages = data.map(msg => ({
        id: msg.id.toString(),
        text: msg.content,
        timestamp: transformFirebaseTimestamp(msg.timestamp),
        isMe: msg.sentByID === idCurrentSession,
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Could not load messages. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [idCurrentSession, userData.id]);

  const transformFirebaseTimestamp = (timestamp) => {
      return new Date(timestamp._seconds * 1000).toISOString();
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = async (text) => {
    if (text.trim().length === 0) return;
    
    const tempMessageId = Date.now().toString();
    
    const newMessage = {
      id: tempMessageId,
      text: text,
      timestamp: new Date().toISOString(),
      isMe: true,
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    try {
      const response = await fetch(`http://ip_personal_con_puerto/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentByID: idCurrentSession,
          sentToID: userData.id,
          content: text,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }      

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    
    }
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
      <MessageChatList messages={messages} isLoading={isLoading} />
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