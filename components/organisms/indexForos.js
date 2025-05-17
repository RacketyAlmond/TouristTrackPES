import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import Title from '../atoms/title';
import TitleLocalidadForo from '../atoms/titleLocalidadForo';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../../config';

export default function IndexForos() {
  const [searchLocalidad, setSearchLocalidad] = useState('');
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [Localidades, setLocalidades] = useState([]);
  const [newForoName, setNewForoName] = useState(''); // Estado para el nombre del nuevo foro

  const obtenerForos = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/forums`); // Cambia esto por la URL de tu servidor
      const json = await response.json();

      if (json.success) {
        const locs = json.forums.map((forum) => {
          /*coger titulo de la Actividad o Localidad*/
          const actividad = forum.Actividad?.trim();
          const localidad = forum.Localidad?.trim();

          const titulo = actividad || localidad || 'Foro sin título';

          return {
            id: forum.id,
            titulo,
          };
        });
        setLocalidades(locs);
      }
    } catch (error) {
      console.error('Error al obtener los foros:', error);
    }
  };

  const crearForo = async () => {
    if (newForoName.trim() === '') {
      alert('El nombre del foro no puede estar vacío.');
      return;
    }

    try {
      const response = await fetch(`${config.BASE_URL}/forums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Localidad: newForoName }),
      });

      const json = await response.json();
      if (json.success) {
        alert('Foro creado exitosamente.');
        setNewForoName(''); // Limpiar el campo de texto
        obtenerForos(); // Actualizar la lista de foros
      } else {
        alert('Error al crear el foro.');
      }
    } catch (error) {
      console.error('Error al crear el foro:', error);
      alert('Error al crear el foro.');
    }
  };

  // Filtrar las localidades cuando cambie el texto de búsqueda
  useEffect(() => {
    filteredLocalidades.length === 0 && setNewForoName(searchLocalidad);
    if (searchLocalidad) {
      const filtered = Localidades.filter((loc) =>
        loc.titulo.toLowerCase().includes(searchLocalidad.toLowerCase()),
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
          {filteredLocalidades.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text
                style={{
                  color: '#572364',
                  marginBottom: 10,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                Crea un nuevo foro
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
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
                  placeholder='Nombre localidad foro que quieres crear...'
                  placeholderTextColor='#888'
                  value={newForoName}
                  onChangeText={setNewForoName}
                />
              </View>
              <TouchableOpacity
                onPress={crearForo}
                style={{
                  backgroundColor: '#572364', // Color de fondo del botón
                  padding: 10,
                  borderRadius: 5, // Bordes redondeados
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}
                >
                  Crear Foro
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              {filteredLocalidades.map((loc, index) => (
                <View key={index} style={{ marginVertical: 0 }}>
                  <TitleLocalidadForo forumId={loc.id} LocName={loc.titulo} />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
