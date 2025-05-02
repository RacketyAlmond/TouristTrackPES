import React, { useState } from 'react';
import {
  Platform,
  Picker as RNPicker,
  Modal,
  TouchableOpacity,
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SelectorPlataforma({
  selectedValue,
  onValueChange,
  options,
  style,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  if (Platform.OS === 'android') {
    return (
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={style}
      >
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.selectorIOS, style]}
      >
        <Text style={styles.selectorText}>{selectedValue}</Text>
      </TouchableOpacity>
      <Modal transparent={true} visible={modalVisible} animationType='slide'>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onValueChange(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.botonCerrar}
            >
              <Text style={styles.textoCerrar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectorIOS: {
    padding: 10,
    backgroundColor: '#dddddd',
    borderRadius: 5,
    justifyContent: 'center',
  },
  selectorText: {
    fontSize: 16,
    color: '#000',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    maxHeight: 400,
  },
  optionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  botonCerrar: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#572364',
    borderRadius: 5,
    alignItems: 'center',
  },
  textoCerrar: {
    color: 'white',
    fontWeight: 'bold',
  },
});
