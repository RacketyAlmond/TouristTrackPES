/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
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
import UsersAppJson from '../../json/userApp.json';
import ChatItem from '../atoms/chatItem';

export default function AddChat({ route }) {
    const navigation = useNavigation();
    const currentUser = route.params.currentUser;
    const idCurrentUser = currentUser.id;
    const UserFriend = route.params.dataJson;
    const data = UsersAppJson;
    const requests = route.params.requestsJson;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedUser, setSearchedUser] = useState(null);
    const [isUserFound, setIsUserFound] = useState(false);

    useEffect(() => {
        setIsUserFound(searchedUser && searchedUser.id);
    }, [searchedUser]);

    const handleSubmit = () => {
        if (!searchTerm.trim()) {
            setSearchedUser(null);
            return;
        }
        const normalizedUser = searchTerm.toLowerCase();
        const searchID = data.find(user => user.id.toLowerCase() === normalizedUser);
        if (!searchID) {
            Alert.alert(
                "USER NOT FOUND",
                `The id doesn't belong to any user.`,
                [
                  { 
                    text: "OK", 
                    style: "default",
                  }
                ],
                { cancelable: false }
              );
            setSearchedUser(null);
        }
        else if (UserFriend.some(friend => friend.id === searchID.id)) {
            Alert.alert(
                "USER ALREADY ADDED", 
                `The user of the id is part of the added chats.`,
                [
                  { 
                    text: "OK", 
                    style: "default",
                  }
                ],
                { cancelable: false }
              );
            setSearchedUser(null);
        }
        else if(searchID.id === idCurrentUser) {
            Alert.alert(
                "USER IS YOURSELF",
                `The user of the id is yourself.`,
                [
                  { 
                    text: "OK", 
                    style: "default",
                  }
                ],
                { cancelable: false }
              );
        }
        else {
            setSearchedUser(searchID);
        }
    };

    const handleChangeText = (text) => {
        setSearchTerm(text);
    };

    const startChat = () => {
        if (searchedUser) {
            const User = searchedUser;
            console.log("User", User);
            console.log("CurrentUser", currentUser);
            Alert.alert(
                "Friend Request Sent",
                `A friend request has been sent to ${searchedUser.name}.`,
                [
                { 
                    text: "OK", 
                    style: "default",
                    onPress: () => {
                    navigation.navigate('PersonalChat', { currentUser,User});
                    setSearchTerm('');
                    setSearchedUser(null);
                    }
                }
                ],
                { cancelable: false }
            );
        } else {
            Alert.alert(
                "Error",
                "Please enter a valid user ID.",
                [{ text: "OK" }]
            );
        }
      };

    const acceptChat = (item) => {
        alert("You have opened a chat with " + item.name);
        setSearchedUser(null);
    };

    const rejectChat = (item) => {
        alert("You have rejected the chat with " + item.name);
        setSearchedUser(null);
    };

    const renderItem = ({ item }) => (
        <View style={styles.chatItem}>
            <TouchableOpacity>
                <ChatItem item={item} />
                <View style={styles.newChatButtonContainer}>
                    <TouchableOpacity style={[styles.newChatButton, { backgroundColor: '#572364' }]} onPress={() => acceptChat(item)}>
                                    <Text style={styles.chatButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.newChatButton, { backgroundColor: '#aaa' }]} onPress={() => rejectChat(item)}>
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
                        <Ionicons name="arrow-back" style={styles.icon} size={24} />
                    </TouchableOpacity>
                <Text style={styles.title}>Add Chat</Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>You can open new chats with users with their ID.</Text>
                    <Text style={styles.description}>A confirmation message will be sent to the user.</Text>
                </View>
                <TextInput 
                    style={styles.searchBar}
                    onSubmitEditing={handleSubmit}
                    onChangeText={handleChangeText}
                    placeholder="Enter the ID of the user"
                    value={searchTerm}
                />
                
                <View style={[
                    styles.userContainer,
                    isUserFound ? styles.userContainerVisible : styles.userContainerHidden
                ]}>
                    {searchedUser && (
                        <>
                            <Image source={{uri: searchedUser.avatar}} style={styles.avatar}/>
                            <View style={styles.nameContainer}>
                                <Text style={styles.username}>{searchedUser.name}</Text>
                                <Text style={styles.userDescription} numberOfLines={2}>{searchedUser.about}</Text>
                            </View>
                            <TouchableOpacity style={styles.chatButton} onPress={startChat}>
                            <Text style={styles.chatButtonText}>Chat</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
            
            <View style={styles.requestsContainer}>
                <Text style={styles.title}>New Chat Requests</Text>
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
        color: "#572364",
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