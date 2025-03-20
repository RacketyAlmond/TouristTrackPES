import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const COUNTRIES = [
  { name: 'England', code: 'GB', flag: '🇬🇧' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
];

export default function Filter({
  selectedCountries,
  setSelectedCountries,
  filterDescriptionVisible,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempSelectedCountries, setTempSelectedCountries] = useState([
    ...selectedCountries,
  ]);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const selectCountry = (country) => {
    if (!tempSelectedCountries.some((c) => c.code === country.code)) {
      setTempSelectedCountries([...tempSelectedCountries, country]);
    } else {
      setTempSelectedCountries(
        tempSelectedCountries.filter((c) => c.code !== country.code),
      );
    }
  };

  const applyFilters = () => {
    setSelectedCountries(tempSelectedCountries);
    toggleModal();
  };

  const removeCountry = (country) => {
    setSelectedCountries(
      selectedCountries.filter((c) => c.code !== country.code),
    );
  };

  return (
    filterDescriptionVisible && (
      <View style={styles.container}>
        <Text style={styles.title}>Filter</Text>
        <Text style={styles.description}>
          This filter allows you to select countries to filter tourism
          statistics within Spain. By default, the filter is set to show
          statistics for all countries.
        </Text>

        <SelectedCountries
          selectedCountries={selectedCountries}
          onRemove={removeCountry}
        />

        <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add filter</Text>
        </TouchableOpacity>

        <CountrySelectionModal
          visible={isModalVisible}
          onClose={toggleModal}
          onSelect={selectCountry}
          selectedCountries={tempSelectedCountries}
          applyFilters={applyFilters}
        />
      </View>
    )
  );
}

const SelectedCountries = ({ selectedCountries, onRemove }) => (
  <ScrollView horizontal style={styles.selectedCountriesContainer}>
    {selectedCountries.map((country) => (
      <TouchableOpacity
        key={country.code}
        style={[styles.countryButton, styles.selected]}
        onPress={() => onRemove(country)}
      >
        <Text style={styles.flag}>{country.flag}</Text>
        <Text style={styles.countryName}>{country.name}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const CountrySelectionModal = ({
  visible,
  onClose,
  onSelect,
  selectedCountries,
  applyFilters,
}) => (
  <Modal visible={visible} animationType='slide' transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name='close' size={24} color='black' />
        </TouchableOpacity>
        <ScrollView style={styles.countryList}>
          {COUNTRIES.map((country) => (
            <TouchableOpacity
              key={country.code}
              style={[
                styles.countryButton,
                selectedCountries.some((c) => c.code === country.code) &&
                  styles.selected,
              ]}
              onPress={() => onSelect(country)}
            >
              <Text style={styles.flag}>{country.flag}</Text>
              <Text style={styles.countryName}>{country.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

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
  flag: {
    fontSize: 20,
    marginRight: 10,
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
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
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
});
