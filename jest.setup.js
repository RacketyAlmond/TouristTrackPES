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
    t: (key) => key, // Devuelve la clave directamente
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));
