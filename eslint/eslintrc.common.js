const OFF = 0;
const ERROR = 2;

const config = {
  env: {
    es6: true,
    browser: true,
    mocha: true,
  },
  extends: 'airbnb',
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
    // TODO (TOR) Ignorert inntil videre grunnet kost/nytte
    'jsx-a11y/anchor-is-valid': OFF,
  },
};

module.exports = config;
