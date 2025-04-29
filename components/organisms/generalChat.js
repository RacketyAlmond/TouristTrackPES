/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
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
import { useNavigation } from '@react-navigation/native';
import UsersJson from '../../json/userFriends.json';
import UserRequests from '../../json/userRequests.json';
import ChatItem from '../atoms/chatItem';
import { Ionicons } from '@expo/vector-icons';

export default function Chats({currentUser}) {
  const idCurrentSession = currentUser.id;
  const dataJson = UsersJson.find(user => user.idUser === idCurrentSession).friends;
  const requestsJson = UserRequests.find(user => user.idUser === idCurrentSession).requests;
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState(dataJson);
  const [icon, setIcon] = useState('search');



  const renderItem = ({ item }) => {
    const User = dataJson.find(user => user.id === item.id);

    return (
      <View style={styles.chatItemContainer}>
        <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('PersonalChat', { currentUser, User})}>
          <ChatItem item={item} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteChat(item)}>
          <Ionicons name="trash-outline" size={22} color="#572364" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleDeleteChat = (item) => {
    Alert.alert(
      "Delete Chat",
      `Are you sure you want to delete the conversation with ${item.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // 1. Actualizar el estado local filtrando el chat eliminado
            const updatedChats = filter.filter(chat => chat.id !== item.id);
            setFilter(updatedChats);
            
            // 2. En una aplicación real, actualizaríamos también los datos persistentes
            // Simulamos una actualización exitosa
            Alert.alert(
              "Success", 
              `Chat with ${item.name} has been deleted.`
            );
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    if(text.length > 0) {
      if(icon === 'search') {
        setIcon('arrow-back');
      }
      const normalizedText = text.toLowerCase();
      const filteredUsers = dataJson.filter(user =>
        user.name.toLowerCase().includes(normalizedText)
      );
      setFilter(filteredUsers);
    }
    else {
      setFilter(dataJson);
      setIcon('search');
    }
  }

  const handleSubmit = () => {
    Keyboard.dismiss();
  }

  const handlebackPress = () => {
    setSearchTerm('');
    setFilter(dataJson);
    setIcon('search');
    Keyboard.dismiss();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.icons} onPress={handlebackPress}>
          <Ionicons name = {icon} size={30} color="#572364" style={styles.icons} />
        </TouchableOpacity>
        <TextInput 
          style={styles.searchBar} 
          placeholder = "Search for a Chat..." 
          onChangeText= {handleSearchChange}
          onSubmitEditing={handleSubmit}
          value = {searchTerm}
          />
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddChat', { currentUser, requestsJson, dataJson})}>
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
