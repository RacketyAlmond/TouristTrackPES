import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert').mockImplementation((title, message) => {
  console.log(`[Mock Alert] ${title}: ${message}`);
});

jest.mock('expo-modules-core', () => {
  return {
    EventEmitter: jest.fn().mockImplementation(() => ({
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    })),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'search.placeholder') return 'Buscar ciudad';
      return key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));
