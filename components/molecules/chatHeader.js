/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRankByLevel } from '../molecules/levelProgress';

const ChatHeader = ({
  contactName,
  contactAvatar,
  contactDescription,
  onBackPress,
}) => {

  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    // Determina el rango del usuario basado en los puntos
    const rank = getRankByLevel(15, true); // Usa los puntos del contacto o 0 por defecto
    setUserRank(rank);
  }, []);
  return (
    <SafeAreaView style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name='arrow-back' size={24} color='#572364' />
      </TouchableOpacity>
      <Image source={{ uri: contactAvatar }} style={styles.avatar} />
      <View style={styles.nameContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.name}>{contactName}</Text>
          {userRank && (
            <Image
              source={userRank.icon}
              style={styles.rankIcon}
              resizeMode="contain"
            />
          )}
        </View>
        <Text style={styles.description} numberOfLines={1}>
          {contactDescription}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 60,
  },
  backButton: {
    padding: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  nameContainer: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: '#888',
  },
  rankIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
});

export default ChatHeader;
