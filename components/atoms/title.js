import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Title({ title }) {
  return (
    <View>
      <Text style={styles.Title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  Title: {
    color: '#572364',
    fontSize: 36,
    fontWeight: 'bold',
  },
});
