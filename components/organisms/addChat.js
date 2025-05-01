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
    const [searchTerm, setSearchTerm] = useState('');
    const [requests, setRequests] = useState([]);
    const [searchedUser, setSearchedUser] = useState(null);
    const [isUserFound, setIsUserFound] = useState(false);

    useEffect(() => {
        setIsUserFound(searchedUser && searchedUser.id);
        fetchRequests();
    }, [searchedUser, idCurrentUser]);

    const fetchRequests = async () => {
        try {
            const response = await fetch(`http://ip_personal/pending-requests/received/${idCurrentUser}`);
            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }
            const data = await response.json();

            const formattedRequests = data.map(request => ({
                id: request.id.toString(),
                name: request.firstName,
                about: request.about,
                avatar: request.avatar,
            }));
            setRequests(formattedRequests);
        } catch (error) {
            console.error('Error fetching requests:', error);
            Alert.alert('Error', 'Could not load requests. Please try again later.');
        } 
    };

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
        //mirar que no se pueda enviar una peticion a un usuario que ya tiene una peticion de ti
        /**else if() {
            Alert.alert(
                "USER HAS A REQUEST",
                `You have already sent a request to the user.`,
                [
                  { 
                    text: "OK", 
                    style: "default",
                  }
                ],
                { cancelable: false }
              );
        }*/
        else if(requests.some(request => request.id === searchID.id)) {
            Alert.alert(
                "USER SENT YOU A REQUEST",
                `The user has already sent you a request.`,
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
            navigation.navigate('PersonalChat', { currentUser, User, state: 2 });
            setSearchTerm('');
            setSearchedUser(null);
        } else {
            Alert.alert(
                "Error",
                "Please enter a valid user ID.",
                [{ text: "OK" }]
            );
        }
    };

    //accepta el chat de les sol·licituds rebudes
    const acceptChat = async (item) => {
        Alert.alert(
            "New Chat Accepted",
            "You have opened a chat with " + item.name + ".",
            [{ text: "OK" }]
        );
        setSearchedUser(null);

        //petició al backend per fer post
        try {
            const response = await fetch(`http://ip_personal/allowed-chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user1ID: idCurrentUser,
                user2ID: item.id,
            }),
            });
            
            if (!response.ok) {
            throw new Error('Failed to accept chat');
            }      
    
        } catch (error) {
            console.error('Error accepting chat:', error);
            Alert.alert('Error', 'Failed to accept chat. Please try again.');
        }

    };

    //rejecta el chat de les sol·licituds rebudes
    const rejectChat = async (item) => {
        Alert.alert(
            "New Chat _Rejected",
            "You have rejected a chat with " + item.name + ".",
            [{ text: "OK" }]
        );
        setSearchedUser(null);

        //petició al backend per delete
        try {
            const response = await fetch(`http://ip_personal/allowed-chats/${item.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            });
            
            if (!response.ok) {
            throw new Error('Failed to reject chat');
            }      
    
        } catch (error) {
            console.error('Error rejecting chat:', error);
            Alert.alert('Error', 'Failed to reject chat. Please try again.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.chatItem}>
            {/* hacer que este boton acceda al personalChat con un navigate y con el state a 1, de manera que este no pueda escribir mensajes*/}
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