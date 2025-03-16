import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const countries = [
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  // Agrega más países según sea necesario
];

export default function SearchBar({ onSelectCountry }) {
  const [searchText, setSearchText] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filterDescriptionVisible, setFilterDescriptionVisible] =
    useState(false);
  const [allCountriesVisible, setAllCountriesVisible] = useState(false);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().startsWith(text.toLowerCase()),
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries([]);
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

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <FontAwesome name='search' size={20} color='black' />
        <TextInput
          style={styles.input}
          placeholder='Search for a locality in Spain'
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          onPress={() => setFilterDescriptionVisible(!filterDescriptionVisible)}
        >
          <MaterialIcons name='filter-list' size={24} color='blue' />
        </TouchableOpacity>
      </View>
      {filterDescriptionVisible && (
        <View style={styles.filterDescription}>
          <Text>
            This filter allows you to select countries to filter tourism
            statistics within Spain. By default, the filter is set to show
            statistics for all countries.
          </Text>
          <TouchableOpacity onPress={() => setFilterDescriptionVisible(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
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
        </View>
      )}
      {filteredCountries.length > 0 && (
        <ScrollView vertical style={styles.results}>
          {filteredCountries.map((country) => (
            <TouchableOpacity
              key={country.code}
              style={styles.countryButton}
              onPress={() => handleSelectCountry(country)}
            >
              <Text style={styles.flag}>{country.flag}</Text>
              <Text style={styles.countryName}>{country.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <Modal visible={allCountriesVisible} animationType='slide'>
        <ScrollView vertical style={styles.modalContainer}>
          <FlatList
            data={countries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
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
            )}
          />
          <TouchableOpacity onPress={() => setAllCountriesVisible(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
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
  },
  filterDescription: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '90%',
  },
  closeButton: {
    color: 'blue',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'right',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
