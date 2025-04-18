import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ForoSearchBar from '../molecules/foroSearchBar';

const Forum = ({ route }) => {
  //parámetros FORO
  const { localityId, localityName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  //parámetros searchBar
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]); // Array for multi-selection

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate fetching messages for this locality
    const mockMessages = [
      {
        id: 1,
        user: 'Usuario1',
        nationality: 'España',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        text: '¿Alguien ha visitado el castillo?',
        timestamp: '2023-04-14 10:30',
      },
      {
        id: 2,
        user: 'Usuario2',
        nationality: 'Francia',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: '¿Qué tal la comida local?',
        timestamp: '2023-04-14 11:45',
      },
      {
        id: 3,
        user: 'Usuario3',
        nationality: 'Alemania',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        text: '¿Sabéis si hay algún buen restaurante cerca?',
        timestamp: '2023-04-14 14:20',
      },
    ];
    setMessages(mockMessages);
    setFilteredMessages(mockMessages);
  }, [localityId]);

  // Filter messages when search or nationality filter changes
  useEffect(() => {
    let filtered = [...messages];
    // Apply nationality filter if selected countries exist
    if (selectedCountries.length > 0) {
      filtered = filtered.filter((message) => {
        // Convert both the message nationality and all selected countries to lowercase for comparison
        const messageNationalityLower = message.nationality.toLowerCase();
        // Check if any of the selected countries match this message's nationality
        return selectedCountries.some(
          (country) => country.name.toLowerCase() === messageNationalityLower,
        );
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((message) =>
        message.text.toLowerCase().includes(query),
      );
    }

    setFilteredMessages(filtered);
  }, [searchQuery, selectedCountries, messages]);

  // Get unique nationalities for filter
  const uniqueNationalities = Array.from(
    new Set(messages.map((message) => message.nationality)),
  );

  // POST NEW QUESTION, NOT SAVED FOR NEXT TIME YET
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // In a real app, you would send this to your backend and get real user info
    const message = {
      id: Date.now(),
      user: 'Tú',
      nationality: 'España', // Replace with actual user nationality
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg', // Replace with actual user avatar
      text: newMessage,
      timestamp: new Date().toLocaleString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  //PONER AVATAR DEL USUARIO CORRESPONDIENTE
  const renderAvatar = (avatar) => {
    if (avatar) {
      return <Image source={{ uri: avatar }} style={styles.avatar} />;
    }
    return (
      <View style={[styles.avatar, styles.defaultAvatar]}>
        <Text style={styles.defaultAvatarText}>
          {messages.user ? messages.user.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/forumBackground.jpg')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <ForoSearchBar
          onSearch={setSearchQuery}
          availableNationalities={uniqueNationalities}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
        />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 0}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{localityName}</Text>
          </View>

          <FlatList
            data={[...filteredMessages].reverse()} // Reverse the order to show newest messages at the top
            keyExtractor={(item) => item.id.toString()}
            style={styles.messageList}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <View style={styles.messageUserInfo}>
                  <View style={styles.avatar}>{renderAvatar(item.avatar)}</View>
                  <View style={styles.userInfo}>
                    <Text style={styles.username}>{item.user}</Text>
                    <Text style={styles.nationality}>{item.nationality}</Text>
                  </View>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
          />

          <View style={styles.inputWrapper}>
            <View style={styles.avatarContainer}>
              {/* User avatar */}
              {renderAvatar('https://randomuser.me/api/portraits/women/90.jpg')}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder='Pregunta lo que quieras'
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={newMessage.trim() === ''}
              >
                <FontAwesome
                  name='send'
                  size={20}
                  color={newMessage.trim() === '' ? '#cccccc' : '#0066cc'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(44, 44, 44, 0.23)',
  },
  searchBarWrapper: {
    marginTop: 0,
    margin: 10,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.65)', // Semi-transparent white
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowRadius: 2,
    margin: 10,
    marginTop: 90,
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    alignSelf: 'flex-start',
    fontSize: 48,
    fontWeight: 'bold',
    color: 'rebeccapurple',
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    padding: 6,
    marginBottom: 6,
  },
  messageUserInfo: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  defaultAvatar: {
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: '#0066cc',
    fontSize: 15,
  },
  nationality: {
    fontSize: 12,
    color: '#666666',
    marginTop: 0,
  },
  timestamp: {
    marginTop: 0,
    fontSize: 12,
    color: '#999999',
    marginLeft: 'auto',
  },
  messageText: {
    fontSize: 15,
    color: '#333333',
    paddingLeft: 50, // Align with the username text
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  avatarContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Forum;
