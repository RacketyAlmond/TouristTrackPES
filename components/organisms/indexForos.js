import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, TextInput } from 'react-native';
import Title from '../atoms/title';
import TitleLocalidadForo from '../atoms/titleLocalidadForo';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://192.168.1.41:3001/forums';

export default function IndexForos() {
  // Estado para el texto de búsqueda
  const [searchLocalidad, setSearchLocalidad] = useState('');
  // Estado para las localidades filtradas
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [Localidades, setLocalidades] = useState([]);

  const obtenerForos = async () => {
    try {
      const response = await fetch('https://192.168.1.100:3001/forums');
      const json = await response.json();

      if (json.success) {
        const locs = json.forums.map((forum) => forum.Localidad);
        setLocalidades(locs);
      }
    } catch (error) {
      console.error('Error al obtener los foros:', error);
    }
  };

  // Filtrar las localidades cuando cambie el texto de búsqueda
  useEffect(() => {
    if (searchLocalidad) {
      const filtered = Localidades.filter((localidad) =>
        localidad.toLowerCase().includes(searchLocalidad.toLowerCase()),
      );
      setFilteredLocalidades(filtered);
    } else {
      // Si no hay texto de búsqueda, mostrar todas las localidades
      setFilteredLocalidades(Localidades);
    }
  }, [searchLocalidad]);

  // Inicializar las localidades filtradas al cargar el componente
  useEffect(() => {
    setFilteredLocalidades(Localidades);
    obtenerForos();
  }, []);

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

      <View
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
        <Title title='Foros' />

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
            placeholderTextColor='#888'
            value={searchLocalidad}
            onChangeText={setSearchLocalidad}
          />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Lista de foros */}
          {filteredLocalidades.map((Localidad, index) => (
            <View key={index} style={{ marginVertical: 0 }}>
              <TitleLocalidadForo LocName={Localidad} />
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
