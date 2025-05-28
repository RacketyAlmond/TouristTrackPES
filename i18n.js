// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Namespaces por pantalla
import mapEn from './assets/locales/en/map.json';
import mapEs from './assets/locales/es/map.json';
import infoEn from './assets/locales/en/info.json';
import infoEs from './assets/locales/es/info.json';
import estadisticasEn from './assets/locales/en/estadisticas.json';
import estadisticasEs from './assets/locales/es/estadisticas.json';
import settingsEn from './assets/locales/en/settings.json';
import settingsEs from './assets/locales/es/settings.json';
import foroEn from './assets/locales/en/foro.json';
import foroEs from './assets/locales/es/foro.json';
import chatsEn from './assets/locales/en/chats.json';
import chatsEs from './assets/locales/es/chats.json';
import profileEn from './assets/locales/en/profile.json';
import profileEs from './assets/locales/es/profile.json';
import ratingsEn from './assets/locales/en/ratings.json';
import ratingsEs from './assets/locales/es/ratings.json';

const resources = {
  en: {
    map: mapEn,
    info: infoEn,
    estadisticas: estadisticasEn,
    settings: settingsEn,
    foro: foroEn,
    chats: chatsEn,
    profile: profileEn,
    ratings: ratingsEn,
  },
  es: {
    map: mapEs,
    info: infoEs,
    estadisticas: estadisticasEs,
    settings: settingsEs,
    foro: foroEs,
    chats: chatsEs,
    profile: profileEs,
    ratings: ratingsEs,
  },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (cb) => {
    const saved = await AsyncStorage.getItem('user-language');
    if (saved) return cb(saved);
    const locales = Localization.locales;
    if (Array.isArray(locales) && locales.length) {
      return cb(locales[0].languageCode);
    }
    return cb('en');
  },
  init: () => {},
  cacheUserLanguage: async (lang) => {
    await AsyncStorage.setItem('user-language', lang);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: [
      'map',
      'info',
      'estadisticas',
      'settings',
      'foro',
      'chats',
      'profile',
      'ratings',
    ], // declara tus namespaces
    defaultNS: 'map', // map por defecto en useTranslation()
    interpolation: { escapeValue: false },
  });

export default i18n;
