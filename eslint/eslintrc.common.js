const OFF = 0;
const ON = 1;
const ERROR = 2;
const { resolve } = require('path');

const config = {
  env: {
    es6: true,
    browser: true,
    mocha: true,
  },

  globals: {
    VERSION: 'off',
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
  settings: {
    'import/resolver': {
      webpack: {
        config: resolve(__dirname, '../webpack/webpack.common.dev_and_prod.js'),
      },
    },
  },
  rules: {
    'linebreak-style': OFF,
    'import/no-named-as-default': OFF,
    'max-len': [ERROR, 160],
    'react/require-default-props': OFF,
    'react/jsx-filename-extension': OFF,
    'no-undef': OFF,
    'react/static-property-placement': OFF,
    'react/state-in-constructor': OFF,

    // TODO (TOR) Ignorert inntil videre grunnet kost/nytte
    'jsx-a11y/anchor-is-valid': OFF,
    'react/jsx-props-no-spreading': OFF,

    // TODO (TOR) Midlertidig utkommentert
    'max-classes-per-file': OFF,
    'jsx-a11y/control-has-associated-label': OFF,

    '@typescript-eslint/no-unused-vars': ERROR,
    '@typescript-eslint/indent': OFF,

    // TODO (TOR) Midlertidig utkommentert
    '@typescript-eslint/explicit-member-accessibility': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/ban-ts-ignore': OFF,
  },
  overrides: [{
    files: ['*.spec.jsx'],
    rules: {
      'no-unused-expressions': OFF,
    },
  }, {
    files: ['*.tsx'],
    rules: {
      'react/prop-types': OFF,
    },
  }],
};
module.exports = config;
