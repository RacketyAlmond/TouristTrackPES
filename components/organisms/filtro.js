import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, FlatList, Vibration } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";



const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const Filtro = ({countryArray}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [textColor, setTextColor] = useState('black');

  const findStats = (country) => {
    console.log(`Pos aqui iria la llamada a la API para obtener las estadisticas de ${country}`);
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    if (text.length > 0) {
      const normalizedText = normalizeString(text);
      const filtered = countryArray.filter((country) =>
        normalizeString(country).includes(normalizedText)
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleSelect = (country) => {
    const normalizedSearchTerm = normalizeString(country);
    const match = countryArray.find(
      (country) => normalizeString(country) === normalizedSearchTerm
    );
    if (!filters.includes(match)) {
      setFilters([...filters, match]);
      findStats(match);
      setSearchTerm('');
      setFilteredOptions([]);
    }
  };

  const handleSubmit = () => {
    if (filteredOptions.length > 0) {
      handleSelect(filteredOptions[0]);
    }
    else {
      setTextColor('#c20303');
      Vibration.vibrate(500);
      setTimeout(() => {
        setTextColor('black');
      }, 500);
    }
  };

  const handleDelete = (filter) => {
    setFilters(filters.filter((item) => item !== filter));
  };

  return (
    // Contenedor principal
    <View style={styles.externalContainer}>
      <Text style={styles.bigText}>Filtrar</Text>
      <Text style={styles.smallText}>Selecciona un país para ver los datos turísticos de sus habitantes</Text>
      
      {/* Contenedor de filtros */}
      <ScrollView horizontal style={styles.scrollContainer}>
        <View style={styles.filterContainer}>
          {filters.map((filter, index) => (
            <View key={index} style={styles.filter}>
              <Text style={styles.filterText}>{filter}</Text>
              <TouchableOpacity onPress={() => handleDelete(filter)}>
                <MaterialIcons name="cancel" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Filtro de búsqueda */}
      <Text> Añadir filtro:</Text>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Buscar país..."
        value={searchTerm}
        onChangeText={handleSearchChange}
        onSubmitEditing={() => handleSubmit()}
      />
      {filteredOptions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelect(item)}>
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
    borderRadius: 15,
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'lightgray',
  },
  scrollContainer: {
    marginVertical: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  filter: {
    flexDirection: 'row',
    backgroundColor: '#003366',
    borderRadius: 10,
    padding: 8,
    marginRight: 5,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  filterText: {
    color: 'white',
    marginRight: 5,
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