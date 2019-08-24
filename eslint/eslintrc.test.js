const merge = require('webpack-merge');
const common = require('./eslintrc.common.js');

const OFF = 0;
const ERROR = 2;

const config = {
  rules: {
    'no-unused-expressions': OFF,
    'no-debugger': ERROR,
    'no-console': ERROR,
    'import/no-extraneous-dependencies': OFF,
  },
};

module.exports = merge(common, config);
