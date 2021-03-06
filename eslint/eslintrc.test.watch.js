const merge = require('webpack-merge');
const common = require('./eslintrc.common.js');

const OFF = 0;
const WARN = 1;

const config = {
  rules: {
    'no-unused-expressions': OFF,
    'no-debugger': WARN,
    'no-console': WARN,
    'import/no-extraneous-dependencies': OFF,
  },
};

module.exports = merge(common, config);
