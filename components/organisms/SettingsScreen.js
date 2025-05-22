import React from 'react';
import { View, Button } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
  const { i18n } = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 16,
      }}
    >
      <Button title='English' onPress={() => i18n.changeLanguage('en')} />
      <Button title='Español' onPress={() => i18n.changeLanguage('es')} />
    </View>
  );
}
