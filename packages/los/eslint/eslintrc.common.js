const OFF = 0;
const ERROR = 2;

const config = {
  root: true,

  env: {
    es6: true,
    browser: true,
    mocha: true,
  },

  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint'],

  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
  ],

  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      ecmaVersion: 8,
      jsx: true,
      impliedStrict: true,
    },
  },

  rules: {
    'linebreak-style': OFF,
    'import/no-named-as-default': OFF,
    'max-len': [ERROR, 160],
    'react/require-default-props': OFF,
    'react/jsx-filename-extension': OFF,
    'no-undef': OFF,

    // TODO (TOR) Skrudd av fordi den feilaktig rapporterar typescript-types som ubrukte
    'no-unused-vars': OFF,

    // TODO (TOR) Ignorert inntil videre grunnet kost/nytte
    'jsx-a11y/anchor-is-valid': OFF,

    '@typescript-eslint/indent': OFF,

    // TODO (TOR) Midlertidig utkommenter
    '@typescript-eslint/explicit-member-accessibility': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
  },
};

module.exports = config;
