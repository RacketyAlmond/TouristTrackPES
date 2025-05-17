import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsAct({ descriptionText }) {
  return (
    <View>
      <Text style={styles.description}>{descriptionText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    marginVertical: 10,
    fontSize: 16,
    color: '#555',
  },
});
