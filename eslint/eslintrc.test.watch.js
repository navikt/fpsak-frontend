const merge = require('webpack-merge');
const path = require('path');
const common = require('./eslintrc.common.js');

const OFF = 0;
const WARN = 1;

const config = {
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname, '../webpack/webpack.test.watch.js'),
      },
    },
  },

  rules: {
    'no-unused-expressions': OFF,
    'no-debugger': WARN,
    'import/no-extraneous-dependencies': OFF,
  },
};

module.exports = merge(common, config);
