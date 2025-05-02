/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatHeader = ({ contactName, contactAvatar, contactDescription, onBackPress }) => {
  return (
    <SafeAreaView style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#572364" />
      </TouchableOpacity>
      <Image source={{ uri: contactAvatar }} style={styles.avatar} />
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{contactName}</Text>
        <Text style ={styles.description} numberOfLines={1}>{contactDescription}</Text>
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
});

export default ChatHeader;