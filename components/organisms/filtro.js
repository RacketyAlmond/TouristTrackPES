import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const normalizeString = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const Filtro = ({ nacionalidadesDisponibles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const obtenerEstadisticas = (nacionalidad) => {
    console.log(
      `Pos aqui iria la llamada a la API para obtener las estadisticas de ${nacionalidad}`,
    );
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    if (text.length > 0) {
      const normalizedText = normalizeString(text);
      const filtered = nacionalidadesDisponibles.filter((nacionalidad) =>
        normalizeString(nacionalidad).includes(normalizedText),
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleSelect = (nacionalidad) => {
    const normalizedSearchTerm = normalizeString(nacionalidad);
    const match = nacionalidadesDisponibles.find(
      (nacionalidad) => normalizeString(nacionalidad) === normalizedSearchTerm,
    );

    if (!filters.includes(match) && nacionalidadesDisponibles.includes(match)) {
      setFilters([...filters, match]);
      obtenerEstadisticas(match);
    }
    setSearchTerm('');
    setFilteredOptions([]);
  };

  const handleDelete = (filter) => {
    setFilters(filters.filter((item) => item !== filter));
  };

  return (
    <View style={styles.externalContainer}>
      <Text style={styles.bigText}>Filtrar por nacionalidad</Text>
      <Text style={styles.smallText}>
        Selecciona la nacionalidad por la que quieres ver las estadísticas
      </Text>

      {/* Contenedor de filtros seleccionados */}
      <ScrollView horizontal style={styles.scrollContainer}>
        <View style={styles.filterContainer}>
          {filters.map((filter, index) => (
            <View key={index} style={styles.filter}>
              <Text style={styles.filterText}>{filter}</Text>
              <TouchableOpacity onPress={() => handleDelete(filter)}>
                <MaterialIcons name='cancel' size={20} color='lightgray' />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder='Buscar país...'
        value={searchTerm}
        onChangeText={handleSearchChange}
        onSubmitEditing={() => handleSelect(searchTerm)}
      />
      {filteredOptions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelect(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  externalContainer: {
    width: '90%',
    borderRadius: 5,
    padding: 20,
    backgroundColor: 'lightgray',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  scrollContainer: {
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filter: {
    flexDirection: 'row',
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginRight: 5,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 5,
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  bigText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Filtro;
