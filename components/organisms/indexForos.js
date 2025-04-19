import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import Title from '../atoms/title';
import TitleLocalidadForo from '../atoms/titleLocalidadForo';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexForos() {
  const Localidades = [
    'Madrid',
    'Barcelona',
    'Valencia',
    'Sevilla',
    'Bilbao',
    'Zaragoza',
    'Malaga',
    'Murcia',
    'Palma de Mallorca',
    'Granada',
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        source={require('../../public/mapa.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          width: '95%',
          padding: 20,
          alignSelf: 'center',
          marginHorizontal: 10,
          marginTop: 60,
          position: 'relative',
          borderRadius: 20,
        }}
      >
        <Title title={'Foros'} />

        {/* Campo para buscar un foro */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 10,
            }}
            placeholder='Busca una localidad...'
            placeholderTextColor={'#888'}
            //value={newQuestion}
            //onChangeText={setNewQuestion}
          />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Lista de foros */}
          {Localidades.map((Localidad, index) => (
            <View key={index} style={{ marginVertical: 0 }}>
              <TitleLocalidadForo LocName={Localidad} />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaView>
  );
}
