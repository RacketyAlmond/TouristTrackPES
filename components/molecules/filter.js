/* eslint-disable prettier/prettier */
//para saber la lista de países en el filtro solo es necesario coger el array countryNames
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import FilterBar from './filterBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AntDesign } from '@expo/vector-icons';
import { getCountryFlag } from '../../utils';

export default function Filter({
  countryArray,
  selectedCountries,
  setSelectedCountries,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempSelectedCountries, setTempSelectedCountries] = useState([]);
  const [countriesWithFlags, setCountriesWithFlags] = useState([]);

  useEffect(() => {
    console.log('countryArray', countryArray);
    const countriesWithFlags = countryArray.map((country) => ({
      name: country,
      flag: getCountryFlag(country),
    }));
    setCountriesWithFlags(countriesWithFlags);
  }, [countryArray]);

  const countryNames = selectedCountries.map((country) => country.name);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const applyFilters = () => {
    /*comprueva que no se repitan los paises pq por alguna razón, si solo pasas un país en tempSelectedCountries,
    este se duplica en selectedCountries a pesar de que selectedCountries estuviera vacío inicialmente*/
    const newSelectedCountries = [
      ...selectedCountries,
      ...tempSelectedCountries.filter(
        (tempCountry) =>
          !selectedCountries.some(
            (selectedCountry) => selectedCountry.name === tempCountry.name,
          ),
      ),
    ];

    setSelectedCountries(newSelectedCountries);
    setTempSelectedCountries([]);
    toggleModal();
  };

  const selectCountry = (country) => {
    if (!tempSelectedCountries.includes(country)) {
      setTempSelectedCountries([...tempSelectedCountries, country]);
    }
  };

  const removeCountry = (country) => {
    setSelectedCountries(
      selectedCountries.filter((c) => c.name !== country.name),
    );
    setTempSelectedCountries(
      tempSelectedCountries.filter((c) => c.name !== country.name),
    );
  };

  /* pretendia hacer que se puedieran eliminar paises escogidos en el modal pero no funciona pa ná.*/
  const removeCountryTemp = (country) => {
    setTempSelectedCountries(
      tempSelectedCountries.filter((c) => c.name !== country.name),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter</Text>
      <Text style={styles.description}>
        This filter allows you to select countries to filter tourism statistics
        within Spain. By default, the filter is set to show statistics for all
        countries.
      </Text>

      <ScrollView horizontal style={styles.selectedCountriesContainer}>
        {selectedCountries.map(({ name, flag }) => (
          <View key={name} style={[styles.countryButton, styles.selected]}>
            <Image source={{ uri: flag }} style={styles.flag} />
            <Text style={styles.countryName}>{name} </Text>
            <TouchableOpacity onPress={() => removeCountry({ name })}>
              <MaterialIcons name='cancel' size={20} color='white' />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add filter</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType='slide' transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <AntDesign name='close' size={24} color='black' />
            </TouchableOpacity>

            <ScrollView horizontal style={styles.selectedCountriesContainer}>
              {tempSelectedCountries.map(({ name, flag }) => (
                <View
                  key={name}
                  style={[styles.countryButton, styles.selected]}
                >
                  <Image source={{ uri: flag }} style={styles.flag} />
                  <Text style={styles.countryName}>{name} </Text>
                </View>
              ))}
            </ScrollView>
            <FilterBar
              countriesWithFlags={countriesWithFlags}
              onSelect={selectCountry}
              selectedCountries={selectedCountries}
            />
            <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  description: {
    textAlign: 'justify',
  },
  selectedCountriesContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  addButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selected: {
    backgroundColor: 'rebeccapurple',
  },
  countryName: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  countryList: {
    width: '100%',
    marginTop: 20,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: 'rebeccapurple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  flag: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
