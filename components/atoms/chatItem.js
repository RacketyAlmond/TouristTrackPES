/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { getRankByLevel, getLevelInfo } from '../molecules/levelProgress';

export default function ChatItem({ item }) {
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const rank = getRankByLevel(getLevelInfo(item.points).currentLevel, true);
    setUserRank(rank);
  }, [item.points]);

  return (
    <View style={styles.userContainer}>
      <Image
        source={{ uri: item.profileImage }}
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
        {item.about && item.about.trim() !== '' && (
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
    flexShrink: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rankIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
    marginBottom: 2,
  },
};
