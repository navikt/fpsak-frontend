const merge = require('webpack-merge');
const common = require('./eslintrc.common.js');

var OFF = 0;

const config = {
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack/webpack.dev.js',
      },
    },
  },

  rules: {
    'no-debugger': OFF,
  },
};

module.exports = merge(common, config);
