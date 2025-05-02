import React from 'react';
import { View, Text } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale.cjs';

export default function Comment({ user, date, text }) {
  // Calcula el tiempo relativo
  const relativeTime = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: es,
  });

  return (
    <View style={{ paddingBottom: 3, paddingTop: 3, marginLeft: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold' }}>{user}</Text>
        <Text style={{ color: 'gray' }}>{relativeTime}</Text>
      </View>
      <Text>{text}</Text>
    </View>
  );
}
