const merge = require('webpack-merge');
const common = require('./eslintrc.common.js');

const ON = 1;
const ERROR = 2;

const config = {
  rules: {
    'no-console': ERROR,
    'import/no-extraneous-dependencies': ON,
  },
};

module.exports = merge(common, config);
