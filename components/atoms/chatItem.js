/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { getRankByLevel } from '../molecules/levelProgress';

export default function ChatItem({ item }) {
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    // Determina el rango del usuario basado en los puntos
    const rank = getRankByLevel(15, true); // Usa los puntos del usuario o 0 por defecto
    setUserRank(rank);
  }, [item.points]);

  return (
    <View style={styles.userContainer}>
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatarRequests}
        resizeMode='cover'
      />
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.username}>{item.name}</Text>
          {userRank && (
            <Image
              source={userRank.icon}
              style={styles.rankIcon}
              resizeMode='contain'
            />
          )}
        </View>
        {item.about &&
          item.about.trim() !== '' && ( // Verifica si "about" no está vacío
            <Text style={styles.message} numberOfLines={1} ellipsizeMode='tail'>
              {item.about.length > 28
                ? `${item.about.slice(0, 28)}...`
                : item.about}
            </Text>
          )}
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
  rankIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
    marginBottom: 2, // Alinea el icono con el texto
  },
};
