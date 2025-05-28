import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function LanguageModal({ visible, onClose }) {
  const { t, i18n } = useTranslation('settings'); // Sin namespace

  const changeTo = (lng) => {
    i18n.changeLanguage(lng);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('language')}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeTo('en')}
          >
            <Text style={styles.buttonText}>{t('english')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeTo('es')}
          >
            <Text style={styles.buttonText}>{t('spanish')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: { paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  buttonText: { fontSize: 16, textAlign: 'center' },
  cancel: { marginTop: 8, paddingVertical: 10 },
  cancelText: { fontSize: 16, color: '#888', textAlign: 'center' },
});
