const merge = require('webpack-merge');
const common = require('./eslintrc.common.js');

const OFF = 0;

const config = {
  rules: {
    'no-debugger': OFF,
    'import/no-extraneous-dependencies': OFF,
  },
};

module.exports = merge(common, config);
