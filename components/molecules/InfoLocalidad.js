import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function InfoLocalidad({ city, numTourists, onClose }) {
  const navigation = useNavigation();

  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });

  useFocusEffect(
    useCallback(() => {
      if (!city) return;

      const fetchRatingStats = async () => {
        try {
          const response = await fetch(
            `http://192.168.1.60:3001/ratings/location/${city}/stats`,
          );
          const data = await response.json();
          setRatingStats({
            average: data.averageStars || 0,
            count: data.totalRatings || 0,
          });
        } catch (error) {
          console.error('Error fetching rating stats:', error);
        }
      };

      fetchRatingStats();
    }, [city]),
  );

  if (!city) return null;
  const locality = {
    name: city,
    comunidad: 'Comunidad',
    rating: ratingStats.average,
    ratingCount: ratingStats.count,
    tourists: numTourists,
    expenses: 100,
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <FontAwesome key={i} name='star' size={20} color='#F5A623' />,
        );
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(
          <FontAwesome
            key={i}
            name='star-half-empty'
            size={20}
            color='#F5A623'
          />,
        );
      } else {
        stars.push(
          <FontAwesome key={i} name='star-o' size={20} color='#F5A623' />,
        );
      }
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialIcons name='close' size={20} color='black' />
      </TouchableOpacity>
      <Text style={styles.title}>{locality.name}</Text>
      <Text style={styles.comunidad}>{locality.comunidad}</Text>
      <TouchableOpacity
        style={styles.ratingContainer}
        onPress={() =>
          navigation.navigate('Valoraciones', { localidad: locality })
        }
      >
        {renderStars(locality.rating)}
        <Text style={styles.ratingAverageText}>{locality.rating}</Text>
        <Text style={styles.ratingCountText}>({locality.ratingCount})</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.info}>Número de turistas: </Text>
        <Text style={styles.valueInfo}>{locality.tourists}</Text>
        <Text style={styles.parameter}> anuales </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.info}>Gasto medio: </Text>
        <Text style={styles.valueInfo}>{locality.expenses}€</Text>
        <Text style={styles.parameter}> por persona y noche </Text>
      </View>
      <TouchableOpacity
        style={styles.estadisticasButton}
        onPress={() =>
          navigation.navigate('Estadisticas', {
            locality: locality,
          })
        }
      >
        <Text style={styles.textButton}>Ver más estadísticas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1, // Asegura que el InfoLocalidad esté por encima del mapa
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 20,
    padding: 10,
    backgroundColor: 'gainsboro',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Asegura que el botón de cerrar esté por encima del InfoLocalidad
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
    color: '#572364',
  },
  comunidad: {
    fontSize: 15,
    marginBottom: 10,
    color: 'gray',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingAverageText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#572364',
  },
  ratingCountText: {
    fontSize: 16,
    marginLeft: 5,
    color: 'gray',
  },
  info: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  parameter: {
    fontSize: 16,
    marginBottom: 5,
    color: 'gray',
  },
  valueInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: '#572364',
  },
  estadisticasButton: {
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 55,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    backgroundColor: '#572364',
  },
  textButton: {
    color: 'white',
    fontSize: 18,
  },
});
