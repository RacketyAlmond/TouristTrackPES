import React from 'react';
import { View, Text, Image } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale.cjs';
import { getRankByLevel } from '../molecules/levelProgress.js';

export default function Comment({ user, date, text, points }) {
  // Calcula el tiempo relativo
  const relativeTime = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: es,
  });

  const userRank = getRankByLevel(points, true); //hardcoded rank for now

  return (
    <View style={{ paddingBottom: 3, paddingTop: 3, marginLeft: 20 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>{user}</Text>
          {userRank && (
            <Image
              source={userRank.icon}
              style={{ width: 20, height: 20, marginLeft: 5 }}
              resizeMode='contain'
            />
          )}
        </View>
        <Text style={{ color: 'gray' }}>{relativeTime}</Text>
      </View>
      <Text>{text}</Text>
    </View>
  );
}
