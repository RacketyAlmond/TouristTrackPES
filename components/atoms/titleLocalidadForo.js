import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TitleLocalidadForo({ LocName }) {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to the Forum screen for this locality
    navigation.navigate('Forum', {
      localityId: LocName,
      localityName: LocName,
    });
  };

  return (
    <View
      style={{
        padding: 10,
        marginVertical: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderTopColor: '#ccc',
        borderTopWidth: 1,
        elevation: 1,
      }}
    >
      <TouchableOpacity onPress={handlePress}>
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
      </TouchableOpacity>
    </View>
  );
}
