import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function DetailsAct({ actividadInfo }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* Descripción */}
      <View style={styles.item}>
        <View style={styles.row}>
          <FontAwesome5 name='align-left' size={16} color='#572364' />
          <Text style={styles.label}>Descripción:</Text>
        </View>
        <Text style={styles.value}>{actividadInfo.Descripcion}</Text>
      </View>

      {/* Fecha */}
      <View style={styles.item}>
        <View style={styles.row}>
          <FontAwesome5 name='calendar' size={16} color='#572364' />
          <Text style={styles.label}>Fecha:</Text>
        </View>
        <Text style={styles.value}>
          {formatDate(actividadInfo.DataIni)} -{' '}
          {formatDate(actividadInfo.DataFi)}
        </Text>
      </View>

      {/* Creador */}
      <View style={styles.item}>
        <View style={styles.row}>
          <FontAwesome5 name='user' size={16} color='#572364' />
          <Text style={styles.label}>Creador:</Text>
        </View>
        <Text style={styles.value}>
          {actividadInfo.Creador || 'Desconocido'}
        </Text>
      </View>

      {/* Ubicación */}
      <View style={styles.item}>
        <View style={styles.row}>
          <FontAwesome5 name='map-marker-alt' size={16} color='#572364' />
          <Text style={styles.label}>Ubicación:</Text>
        </View>
        <Text style={styles.value}>
          Lat: {actividadInfo.Ubicacion?.latitud ?? '0'}, Long:{' '}
          {actividadInfo.Ubicacion?.longitud ?? '0'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#572364',
    marginBottom: 15,
  },
  item: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  label: {
    fontWeight: 'bold',
    color: '#572364',
    marginLeft: 8,
    fontSize: 15,
  },
  value: {
    color: '#333',
    fontSize: 15,
    marginLeft: 24,
  },
});
