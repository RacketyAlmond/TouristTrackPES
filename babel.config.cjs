module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    'babel-preset-expo', // Asegúrate de incluir esto si usas Expo
  ],
  plugins: ['react-native-reanimated/plugin'], // Agrega este plugin aquí
};
