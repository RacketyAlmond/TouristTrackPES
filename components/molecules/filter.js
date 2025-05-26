/* eslint-disable prettier/prettier */
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
import { useTranslation } from 'react-i18next';

export default function Filter({
  countryArray,
  selectedCountries,
  setSelectedCountries,
}) {
  const { t } = useTranslation(); // usamos namespace por defecto
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempSelectedCountries, setTempSelectedCountries] = useState([]);
  const [countriesWithFlags, setCountriesWithFlags] = useState([]);

  useEffect(() => {
    const withFlags = countryArray?.map((country) => ({
      name: country,
      flag: getCountryFlag(country),
    }));
    setCountriesWithFlags(withFlags);
  }, [countryArray]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const applyFilters = () => {
    const newSelected = [
      ...selectedCountries,
      ...tempSelectedCountries.filter(
        (temp) => !selectedCountries.some((sel) => sel.name === temp.name),
      ),
    ];
    setSelectedCountries(newSelected);
    setTempSelectedCountries([]);
    toggleModal();
  };

  const selectCountry = (country) => {
    if (!tempSelectedCountries.some((c) => c.name === country.name)) {
      setTempSelectedCountries([...tempSelectedCountries, country]);
    }
  };

  const removeCountry = (country) => {
    setSelectedCountries((curr) => curr.filter((c) => c.name !== country.name));
    setTempSelectedCountries((curr) =>
      curr.filter((c) => c.name !== country.name),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('filter.header')}</Text>
      <Text style={styles.description}>{t('filter.description')}</Text>

      <ScrollView
        horizontal
        style={styles.selectedCountriesContainer}
        showsHorizontalScrollIndicator={false}
      >
        {selectedCountries?.map(({ name, flag }) => (
          <View key={name} style={[styles.countryButton, styles.selected]}>
            <Image source={{ uri: flag }} style={styles.flag} />
            <Text style={styles.countryName}>{name}</Text>
            <TouchableOpacity onPress={() => removeCountry({ name })}>
              <MaterialIcons name='cancel' size={20} color='white' />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
        <Text style={styles.addButtonText}>{t('filter.click')}</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType='slide' transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <AntDesign name='close' size={24} color='black' />
            </TouchableOpacity>

            <ScrollView
              horizontal
              style={styles.selectedCountriesContainer}
              showsHorizontalScrollIndicator={false}
            >
              {tempSelectedCountries.map(({ name, flag }) => (
                <View
                  key={name}
                  style={[styles.countryButton, styles.selected]}
                >
                  <Image source={{ uri: flag }} style={styles.flag} />
                  <Text style={styles.countryName}>{name}</Text>
                </View>
              ))}
            </ScrollView>

            <FilterBar
              countriesWithFlags={countriesWithFlags}
              onSelect={selectCountry}
              selectedCountries={selectedCountries}
            />

            <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>{t('filter.apply')}</Text>
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
    marginBottom: 10,
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
    backgroundColor: '#572364',
  },
  countryName: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  flag: {
    width: 20,
    height: 20,
    marginRight: 8,
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
  applyButton: {
    marginTop: 20,
    backgroundColor: '#572364',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
