const merge = require('webpack-merge');
const path = require('path');
const common = require('./eslintrc.common.js');

const OFF = 0;

const config = {
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname,'../webpack/webpack.dev.js'),
      },
    },
  },

  rules: {
    'no-debugger': OFF,
  },
};

module.exports = merge(common, config);
