import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const renderAvatar = (avatar) => {
  if (avatar) {
    return <Image source={{ uri: avatar }} style={styles.avatar} />;
  }
};

export default function Avatar({ avatar }) {
  return <View style={styles.Avatar}>{renderAvatar(avatar)}</View>;
}

const styles = StyleSheet.create({
  Avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
