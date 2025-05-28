import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  Platform,
  StatusBar,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ChatItem from '../atoms/chatItem';
import { auth } from '../../firebaseConfig.js';
import { useTranslation } from 'react-i18next';

export default function AddChat({ route }) {
  const { t } = useTranslation('chats');
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const idCurrentUser = currentUser.uid;
  const nameCurrentUser = currentUser.name;
  const UserFriends = route.params.dataJson || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [Users, setUsers] = useState([]);
  const [searchedUser, setSearchedUser] = useState(null);
  const [isUserFound, setIsUserFound] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [UserFriend, setUserFriend] = useState(UserFriends || []);

  useEffect(() => {
    setIsUserFound(searchedUser && searchedUser.id);
    fetchUsers();
    fetchRequests();
    fetchSentRequests();
  }, [searchedUser, idCurrentUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`***REMOVED***/users/`);
      if (!response.ok) {
        throw new Error(t('failedFetchUsers'));
      }
      const data = await response.json();
      const formattedUsers = data.usuarios.map((user) => ({
        id: user.id.toString(),
        name: user.firstName,
        about: user.about,
        avatar: user.avatar,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', t('notLoadUsers'));
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `***REMOVED***/pending-requests/received/${idCurrentUser}`,
      );
      if (!response.ok) {
        throw new Error(t('failedFetchRequests'));
      }
      const data = await response.json();

      const formattedRequests = data.map((request) => ({
        id: request.id.toString(),
        name: request.firstName,
        about: request.about,
        avatar: request.avatar,
      }));
      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', t('notLoadRequests'));
    }
  };

  const fetchSentRequests = async () => {
    try {
      const response = await fetch(
        `***REMOVED***/pending-requests/sent/${idCurrentUser}`,
      );
      if (!response.ok) {
        throw new Error(t('failedFetchSentRequests'));
      }
      const data = await response.json();

      const formattedRequests = data.map((request) => ({
        id: request.id.toString(),
        name: request.firstName,
        about: request.about,
        avatar: request.avatar,
      }));
      setSentRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
      Alert.alert('Error', t('notLoadSentRequests'));
    }
  };

  const handleSubmit = () => {
    if (!searchTerm.trim()) {
      setSearchedUser(null);
      return;
    }
    const normalizedUser = searchTerm.toLowerCase();
    const searchID = Users.find(
      (user) => user.name && user.name.toLowerCase() === normalizedUser,
    );
    if (!searchID) {
      Alert.alert(
        t('not-found'),
        t('not-found-text'),
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
        { cancelable: false },
      );
      setSearchedUser(null);
    } else if (UserFriend.some((friend) => friend.name === searchID.name)) {
      Alert.alert(
        t('userAAdded'),
        t('userAAddedDesc'),
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
        { cancelable: false },
      );
      setSearchedUser(null);
    } else if (searchID.name === nameCurrentUser) {
      Alert.alert(
        t('userYourserf'),
        t('userYourserfDesc'),
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
        { cancelable: false },
      );
    } else if (sentRequests.some((request) => request.name === searchID.id)) {
      Alert.alert(
        t('userRequest'),
        t('userRequestDesc'),
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
        { cancelable: false },
      );
    } else if (requests.some((request) => request.name === searchID.name)) {
      Alert.alert(
        t('userSentRequest'),
        t('userRequestDesc'),
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
        { cancelable: false },
      );
    } else {
      setSearchedUser(searchID);
    }
  };

  const handleChangeText = (text) => {
    setSearchTerm(text);
  };

  const startChat = () => {
    if (searchedUser) {
      const User = searchedUser;
      navigation.navigate('PersonalChat', { currentUser, User, state: 2 });
      setSearchTerm('');
      setSearchedUser(null);
    } else {
      Alert.alert('Error', t('enterValidID'), [{ text: 'OK' }]);
    }
  };

  const acceptChat = async (item) => {
    Alert.alert(
      t('newChatAccepted'),
      t('newChatAcceptedDesc') + item.name + '.',
      [{ text: 'OK' }],
    );
    setSearchedUser(null);

    try {
      const response = await fetch(
        `***REMOVED***/allowed-chats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user1ID: idCurrentUser,
            user2ID: item.id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(t('failedAcceptChat'));
      }

      setRequests((prev) => prev.filter((req) => req.id !== item.id));

      setUserFriend((prevUserFriend) => {
        if (!prevUserFriend.some((friend) => friend.id === item.id)) {
          return [...prevUserFriend, item];
        }
        return prevUserFriend;
      });
    } catch (error) {
      console.error('Error accepting chat:', error);
      Alert.alert('Error', t('failedAcceptChat2'));
    }
  };

  const rejectChat = async (item) => {
    Alert.alert(t('chatRejected'), t('chatRejectedDesc') + item.name + '.', [
      { text: 'OK' },
    ]);
    setSearchedUser(null);

    try {
      const response = await fetch(
        `***REMOVED***/pending-requests`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sentToID: idCurrentUser,
            sentByID: item.id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(t('failedRejectChat'));
      }

      setRequests((prev) => prev.filter((req) => req.id !== item.id));
    } catch (error) {
      console.error('Error rejecting chat:', error);
      Alert.alert('Error', t('failedRejectChat2'));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.chatItem}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('PersonalChat', {
            currentUser,
            User: item,
            state: 1,
          })
        }
      >
        <ChatItem item={item} />
        <View style={styles.newChatButtonContainer}>
          <TouchableOpacity
            style={[styles.newChatButton, { backgroundColor: '#572364' }]}
            onPress={() => acceptChat(item)}
          >
            <Text style={styles.chatButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.newChatButton, { backgroundColor: '#aaa' }]}
            onPress={() => rejectChat(item)}
          >
            <Text style={styles.chatButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View height={15} />
      <View style={styles.newChatContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' style={styles.icon} size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('add')}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{t('text1')}</Text>
          <Text style={styles.description}>{t('text2')}</Text>
        </View>
        <TextInput
          style={styles.searchBar}
          onSubmitEditing={handleSubmit}
          onChangeText={handleChangeText}
          placeholder={t('create')}
          value={searchTerm}
        />

        <View
          style={[
            styles.userContainer,
            isUserFound
              ? styles.userContainerVisible
              : styles.userContainerHidden,
          ]}
        >
          {searchedUser && (
            <>
              <Image
                source={{ uri: searchedUser.avatar }}
                style={styles.avatar}
              />
              <View style={styles.nameContainer}>
                <Text style={styles.username}>{searchedUser.name}</Text>
                <Text style={styles.userDescription} numberOfLines={2}>
                  {searchedUser.about}
                </Text>
              </View>
              <TouchableOpacity style={styles.chatButton} onPress={startChat}>
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.requestsContainer}>
        <Text style={styles.title}>{t('new-request')}</Text>
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
  newChatContainer: {
    paddingBottom: 5,
    marginHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 10,
  },
  icon: {
    color: '#572364',
    marginLeft: 10,
    marginTop: 7,
    marginRight: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionContainer: {
    marginBottom: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  searchBar: {
    height: 50,
    width: '85%',
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  userContainerVisible: {
    maxHeight: 100,
    opacity: 1,
    marginBottom: 20,
  },
  userContainerHidden: {
    maxHeight: 0,
    opacity: 0,
    padding: 0,
    marginBottom: 0,
    borderWidth: 0,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDescription: {
    fontSize: 14,
    color: '#888',
    marginRight: 10,
  },
  requestsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  chatItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  newChatButtonContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  newChatButton: {
    width: '40%',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  listContent: {
    width: '100%',
  },
  chatButton: {
    backgroundColor: '#572364',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
