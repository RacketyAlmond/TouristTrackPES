import React, { useState, useEffect } from 'react';
import { View, ImageBackground, ScrollView, TextInput } from 'react-native';
import Title from '../atoms/title';
import TitleLocalidadForo from '../atoms/titleLocalidadForo';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexForos() {
  const [searchLocalidad, setSearchLocalidad] = useState('');
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [Localidades, setLocalidades] = useState([]);

  const obtenerForos = async () => {
    try {
      const response = await fetch('http://192.168.1.41:3001/forums'); // Cambia esto por la URL de tu servidor + ejecuta "node server.js" en rama forum
      const json = await response.json();

      if (json.success) {
        const locs = json.forums.map((forum) => ({
          id: forum.id,
          localidad: forum.Localidad,
        }));
        setLocalidades(locs);
      }
    } catch (error) {
      console.error('Error al obtener los foros:', error);
    }
  };

  // Filtrar las localidades cuando cambie el texto de búsqueda
  useEffect(() => {
    if (searchLocalidad) {
      const filtered = Localidades.filter((loc) =>
        loc.localidad.toLowerCase().includes(searchLocalidad.toLowerCase()),
      );
      setFilteredLocalidades(filtered);
    } else {
      // Si no hay texto de búsqueda, mostrar todas las localidades
      setFilteredLocalidades(Localidades);
    }
  }, [searchLocalidad, Localidades]);

  // Inicializar las localidades filtradas al cargar el componente
  useEffect(() => {
    setFilteredLocalidades(Localidades);
    obtenerForos();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../public/mapa.png')}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}
        resizeMode='cover'
      >
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
            {filteredLocalidades.map((loc, index) => (
              <View key={index} style={{ marginVertical: 0 }}>
                <TitleLocalidadForo forumId={loc.id} LocName={loc.localidad} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
