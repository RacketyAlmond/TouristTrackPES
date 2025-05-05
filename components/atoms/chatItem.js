/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, Image } from 'react-native';

export default function ChatItem({ item }) {
  return (
    <View style={styles.userContainer}>
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatarRequests}
        resizeMode='cover'
      />
      <View>
        <Text style={styles.username}>{item.name}</Text>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode='tail'>
          {item.about.length > 28
            ? `${item.about.slice(0, 28)}...`
            : item.about}
        </Text>
      </View>
    </View>
  );
}

const styles = {
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 10,
  },
  avatarRequests: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    color: '#555',
    fontSize: 14,
    flexShrink: 1, // Permite que el contenedor se reduzca
    overflow: 'hidden', // Asegura que el texto no sobresalga del contenedor
    textOverflow: 'ellipsis', // Agrega puntos suspensivos si el texto es muy largo
  },
};
