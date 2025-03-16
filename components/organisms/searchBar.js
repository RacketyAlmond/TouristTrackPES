import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
} from 'react-native';
import { FontAwesome, MaterialIcons, AntDesign } from '@expo/vector-icons';

const countries = [
  { name: 'England', code: 'GB', flag: '🇬🇧' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  // Agrega más países según sea necesario
];

const localities = [
  { name: 'Madrid' },
  { name: 'Barcelona' },
  { name: 'Valencia' },
  { name: 'Seville' },
  { name: 'Zaragoza' },
  // Agrega más localidades según sea necesario
];

export default function SearchBar({ onSelectLocality }) {
  const [searchText, setSearchText] = useState('');
  const [filteredLocalities, setFilteredLocalities] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filterDescriptionVisible, setFilterDescriptionVisible] =
    useState(false);
  const [allCountriesVisible, setAllCountriesVisible] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState(null);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = localities.filter((locality) =>
        locality.name.toLowerCase().startsWith(text.toLowerCase()),
      );
      setFilteredLocalities(filtered);
    } else {
      setFilteredLocalities([]);
    }
  };

  const handleSelectCountry = (country) => {
    if (!selectedCountries.includes(country)) {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const handleRemoveCountry = (country) => {
    setSelectedCountries(selectedCountries.filter((c) => c !== country));
  };

  const handleSelectLocality = (locality) => {
    setSearchText(locality.name);
    setFilteredLocalities([]);
    setSelectedLocality(locality.name);
    onSelectLocality(locality);
  };

  const handleSubmitEditing = () => {
    const locality = localities.find(
      (loc) => loc.name.toLowerCase() === searchText.toLowerCase(),
    );
    if (locality) {
      setSelectedLocality(locality.name);
      onSelectLocality(locality);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <FontAwesome name='search' size={20} color='black' />
        <TextInput
          style={styles.input}
          placeholder='Search for a locality in Spain'
          value={searchText}
          onChangeText={handleSearch}
          onSubmitEditing={handleSubmitEditing}
        />
        <TouchableOpacity
          onPress={() => setFilterDescriptionVisible(!filterDescriptionVisible)}
        >
          <MaterialIcons name='filter-list' size={24} color='blue' />
        </TouchableOpacity>
      </View>
      {filteredLocalities.length > 0 && (
        <ScrollView vertical style={styles.results}>
          {filteredLocalities.map((locality, index) => (
            <TouchableOpacity
              key={index}
              style={styles.countryButton}
              onPress={() => handleSelectLocality(locality)}
            >
              <Text style={styles.countryName}>{locality.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {filterDescriptionVisible && (
        <View style={styles.filterDescription}>
          <TouchableOpacity
            style={styles.closeIconTouchable}
            onPress={() => setFilterDescriptionVisible(false)}
          >
            <AntDesign name='close' size={24} color='black' />
          </TouchableOpacity>
          <Text style={styles.filterDescriptionText}>
            This filter allows you to select countries to filter tourism
            statistics within Spain. By default, the filter is set to show
            statistics for all countries.
          </Text>
          <ScrollView horizontal style={styles.selectedCountries}>
            {selectedCountries.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={[styles.countryButton, styles.selectedCountryButton]}
                onPress={() => handleRemoveCountry(country)}
              >
                <Text style={styles.flag}>{country.flag}</Text>
                <Text style={styles.countryName}>{country.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setAllCountriesVisible(true)}
            style={styles.centeredButton}
          >
            <Text style={styles.addFilterButton}>Add filter</Text>
          </TouchableOpacity>
          <Modal
            visible={allCountriesVisible}
            animationType='slide'
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeIconTouchable}
                  onPress={() => setAllCountriesVisible(false)}
                >
                  <AntDesign name='close' size={24} color='black' />
                </TouchableOpacity>
                <ScrollView style={styles.countryList}>
                  {countries.map((item) => (
                    <TouchableOpacity
                      key={item.code}
                      style={[
                        styles.countryButton,
                        selectedCountries.includes(item) &&
                          styles.selectedCountryButton,
                      ]}
                      onPress={() => {
                        handleSelectCountry(item);
                        setAllCountriesVisible(false);
                      }}
                    >
                      <Text style={styles.flag}>{item.flag}</Text>
                      <Text style={styles.countryName}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    zIndex: 1, //muestra encima del mapa
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    outlineStyle: 'none',
  },
  filterDescription: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '90%',
  },
  filterDescriptionText: {
    marginRight: 35,
    padding: 5,
    textAlign: 'justify',
  },
  closeIconTouchable: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10, // Aumentar el área de clic
  },
  selectedCountries: {
    marginTop: 10,
    marginBottom: 10,
  },
  addFilterButton: {
    color: 'blue',
    marginTop: 10,
  },
  centeredButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  results: {
    marginTop: 20,
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
    elevation: 5,
  },
  selectedCountryButton: {
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
  countryList: {
    width: '100%',
    marginTop: 40,
  },
});
