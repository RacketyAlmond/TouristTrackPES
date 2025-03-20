const { rules } = require('eslint-config-prettier');

// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn',
    'react/jsx-curly-brace-presence': [
      'warn',
      { props: 'never', children: 'never' },
    ],
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['/dist/*', 'node_modules'],
};
