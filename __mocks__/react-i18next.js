// __mocks__/react-i18next.js
module.exports = {
  useTranslation: () => {
    return {
      t: (key) => {
        const translations = {
          'about-me': 'Sobre mí',
          birthdate: 'Fecha de nacimiento',
          'see-comments': 'Ver comentarios',
          'see-reviews': 'Ver reseñas',
          'change-language': 'Cambiar idioma',
          'log-out': 'Cerrar sesión',
          // agrega aquí más claves que uses en tus tests
        };
        return translations[key] || key;
      },
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
};
