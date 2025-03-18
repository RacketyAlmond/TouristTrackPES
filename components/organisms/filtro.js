/* eslint-disable prettier/prettier */
// Filtro.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

const nacionalidadesDisponibles = ['España', 'Francia', 'Italia', 'Alemania', 'Argentina','Polonia'];

const Filtro = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);

  const obtenerEstadisiticas = (nacionalidad) => {
    console.log(`Pos aqui iria la llamada a la API para obtener las estadisticas de ${nacionalidad}`);
  }

  const handleKeyPress = () => {
    if (nacionalidadesDisponibles.includes(searchTerm) && !filters.includes(searchTerm)) {
      setFilters((prevFilters) => [...prevFilters, searchTerm]);
      setSearchTerm("");
      obtenerEstadisiticas(searchTerm);
    }
  };

  const handleDelete = (filter) => {
    setFilters((prevFilters) => prevFilters.filter((item) => item !== filter));
  };


  return (
    <View style={styles.externalContainer}>
      <Text style={styles.bigText}>Filtrar por nacionalidad</Text>
      <Text style={styles.smallText}>Selecciona la nacionalidad por la que quieres ver las estadisticas</Text>
      <ScrollView horizontal={true} style={styles.scrollContainer}>
        <View style={styles.filterContainer}>
          {filters.map((filter, index) => (
            <View key={index} style={styles.filter}>
              <Text style={styles.filterText}>{filter}</Text>
              <TouchableOpacity onPress={() => handleDelete(filter)}>
                <MaterialIcons name="cancel" size={20} color="lightgray" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <View padding={10} />
        <TextInput
          style={styles.input}
          placeholder="Buscar país..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleKeyPress}
        />
    </View>
  );

};
const styles = StyleSheet.create({
  externalContainer: {
    maxHeight: '33%',
    width: '90%',
    borderRadius: 5,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'left',
    backgroundColor: 'lightgray',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  filterContainer: {
    flexDirection: 'row',
    minWidth: '100%',
    paddingTop: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  filter : {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: 'gray',
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 12,
    fontFamily: 'Calibri',
    color: 'black',
    marginLeft: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  bigText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Calibri',
    color: 'black',
    marginTop: 10,
  },
});

export default Filtro;
