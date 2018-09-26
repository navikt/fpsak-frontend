const merge = require('webpack-merge');
const common = require('./eslintrc.common.js');
const path = require('path');

const OFF = 0, WARN = 1;

const config = {
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve('./webpack/webpack.test.watch.js'),
      },
    },
  },

  rules: {
    'no-unused-expressions': OFF,
    'no-debugger': WARN,
  },
};

module.exports = merge(common, config);
