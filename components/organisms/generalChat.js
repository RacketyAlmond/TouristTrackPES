/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
//import UsersJson from '../../json/userFriends.json';
import ChatItem from '../atoms/chatItem';
import { Ionicons } from '@expo/vector-icons';

export default function Chats() {
  const currentUser = {
    id: '0',
    name: 'Yo',
    avatar: 'https://i.pinimg.com/474x/24/0d/b3/asdsaeeedsseed.jpg',
    about: 'hi',
  };
  const idCurrentSession = currentUser.id;
  //const dataJson = UsersJson.find(
  //(user) => user.idUser === idCurrentSession,
  //).friends;
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState([]);
  const [icon, setIcon] = useState('search');
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const state = 0; // 0 = chat, 1 = requested, 2 = request

  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3001/allowed-chats/users/${idCurrentSession}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      const data = await response.json();
      const formattedChats = data.map((chat) => ({
        id: chat.id.toString(),
        name: chat.firstName,
        about: chat.about,
        avatar: chat.avatar,
      }));

      setChats(formattedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      Alert.alert('Error', 'Could not load chats. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [idCurrentSession]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Ejecutar fetchChats cada vez que el componente reciba el foco
  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [fetchChats]),
  );

  useEffect(() => {
    setFilter(chats);
  }, [chats]);

  const deleteAllowedChat = async (user1Id, user2Id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/allowed-chats/between/${user1Id}/${user2Id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete allowed chat');
      }
    } catch (error) {
      console.error('Error deleting allowed chat:', error);
      Alert.alert('Error', 'Could not delete chat. Please try again.');
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.chatItemContainer}>
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() =>
            navigation.navigate('PersonalChat', {
              currentUser,
              User: item,
              state,
            })
          }
        >
          <ChatItem item={item} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteChat(item)}
        >
          <Ionicons name='trash-outline' size={22} color='#572364' />
        </TouchableOpacity>
      </View>
    );
  };

  const deleteChat = async (user1Id, user2Id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/messages/between/${user1Id}/${user2Id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      setChats(chats.filter((chat) => chat.id !== user2Id))
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleDeleteChat = (item) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete the conversation with ${item.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedChats = filter.filter((chat) => chat.id !== item.id);
            setFilter(updatedChats);

            //funció per eliminar els missatges del chat
            deleteChat(idCurrentSession, item.id);
            //afagir a sota la funció amb la petició per eliminar el chat de la base de dades d'allowed
            deleteAllowedChat(idCurrentSession, item.id);

            Alert.alert('Success', `Chat with ${item.name} has been deleted.`);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    if (text.length > 0) {
      if (icon === 'search') {
        setIcon('arrow-back');
      }
      const normalizedText = text.toLowerCase();
      const filteredUsers = chats.filter((user) =>
        user.name.toLowerCase().includes(normalizedText),
      );
      setFilter(filteredUsers);
    } else {
      setFilter(chats);
      setIcon('search');
    }
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
  };

  const handlebackPress = () => {
    setSearchTerm('');
    setFilter(chats);
    setIcon('search');
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.icons} onPress={handlebackPress}>
          <Ionicons
            name={icon}
            size={30}
            color='#572364'
            style={styles.icons}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder='Search for a Chat...'
          onChangeText={handleSearchChange}
          onSubmitEditing={handleSubmit}
          value={searchTerm}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('AddChat', {
              currentUser,
              state,
              dataJson: chats, // <-- Aquí le pasas la lista de chats a AddChat
            })
          }
        >
          <Text style={styles.textButton}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filter}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:
      Platform.OS === 'android'
        ? Math.min(StatusBar.currentHeight || 30, 30)
        : 0,
  },
  listContent: {
    paddingHorizontal: 12,
  },
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginLeft: 'auto',
  },
  topBar: {
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icons: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  searchBar: {
    width: '70%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  addButton: {
    backgroundColor: '#572364',
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
