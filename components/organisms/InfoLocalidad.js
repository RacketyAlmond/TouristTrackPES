import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function InfoLocalidad({ locality, onClose }) {
  if (!locality) return null;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesome key={i} name='star' size={20} color='gold' />);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(
          <FontAwesome key={i} name='star-half-empty' size={20} color='gold' />,
        );
      } else {
        stars.push(
          <FontAwesome key={i} name='star-o' size={20} color='gold' border />,
        );
      }
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{locality.name}</Text>
      <Text style={styles.comarca}>{locality.comarca}</Text>
      <View style={styles.ratingContainer}>
        {renderStars(locality.rating)}
        <Text style={styles.ratingText}>
          {locality.rating} ({locality.ratingCount})
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.info}>
          Número de turistas: {locality.tourists}M
        </Text>
        <Text style={styles.parameter}> anuales </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.info}>Gasto medio: {locality.expenses}€</Text>
        <Text style={styles.parameter}> por persona y noche </Text>
      </View>
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
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
    color: 'rebeccapurple',
  },
  comarca: {
    fontSize: 15,
    marginBottom: 10,
    color: 'gray',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  parameter: {
    fontSize: 16,
    marginBottom: 5,
    color: 'gray',
  },
});
