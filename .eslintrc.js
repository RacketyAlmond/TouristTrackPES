const { rules } = require('eslint-config-prettier');

// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Marca como error cualquier inconsistencia con las reglas de Prettier
    'react/react-in-jsx-scope': 'off', // No necesario en proyectos Expo/React Native
    'no-unused-vars': 'warn', // Puedes ajustar a 'error' si prefieres ser más estricto
    'react/jsx-curly-brace-presence': [
      'warn',
      { props: 'never', children: 'never' },
    ], // Evita llaves innecesarias en JSX
  },
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ['/dist/*', 'node_modules'],
};
