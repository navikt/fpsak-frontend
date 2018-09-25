const merge = require('webpack-merge');
const common = require('./eslintrc.common.js');
const path = require('path');
var OFF = 0;

const config = {
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve('./webpack/webpack.dev.js'),
      },
    },
  },

  rules: {
    'no-debugger': OFF,
  },
};

module.exports = merge(common, config);
