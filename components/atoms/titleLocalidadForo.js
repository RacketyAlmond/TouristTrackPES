import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TitleLocalidadForo({ LocName, forumId }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Forum', {
      localityName: LocName,
      forumId: forumId,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={{
          padding: 10,
          marginVertical: 0,
          borderTopColor: '#ccc',
          borderTopWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#572364',
              fontSize: 24,
              fontWeight: 'bold',
              margin: 5,
            }}
          >
            {LocName}
          </Text>
          <Text style={{ color: '#572364', fontSize: 24, fontWeight: 'bold' }}>
            →
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
