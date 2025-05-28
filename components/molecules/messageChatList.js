/* eslint-disable prettier/prettier */
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import MessageChatBubble from '../atoms/messageChatBubble';
import MessageChatData from '../atoms/messageChatData';
import { useTranslation } from 'react-i18next';

const MessageChatList = ({ messages }) => {
  const { i18n } = useTranslation();

  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const messageDay = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate(),
    );
    const todayDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const yesterdayDay = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
    );

    const currentLocale = i18n.language === 'es' ? 'es-ES' : 'en-US';

    if (messageDay.getTime() === todayDay.getTime()) {
      return i18n.language === 'es' ? 'HOY' : 'TODAY';
    } else if (messageDay.getTime() === yesterdayDay.getTime()) {
      return i18n.language === 'es' ? 'AYER' : 'YESTERDAY';
    } else {
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      return messageDate
        .toLocaleDateString(currentLocale, options)
        .toUpperCase();
    }
  };

  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp);
      const datePart = messageDate.toISOString().split('T')[0];

      if (datePart !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            formattedDate: formatDate(currentGroup[0].timestamp),
            data: currentGroup,
          });
        }
        currentDate = datePart;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        formattedDate: formatDate(currentGroup[0].timestamp),
        data: currentGroup,
      });
    }

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  const renderItem = ({ item }) => {
    return (
      <View>
        <MessageChatData date={item.formattedDate} />
        {item.data.map((message) => (
          <MessageChatBubble key={message.id} message={message} />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messageGroups}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  contentContainer: {
    paddingVertical: 10,
  },
});

export default MessageChatList;
