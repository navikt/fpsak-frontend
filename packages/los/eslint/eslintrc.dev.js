const merge = require('webpack-merge');
const common = require('./eslintrc.common.js');

const OFF = 0;

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
    'import/no-extraneous-dependencies': OFF,
  },
};

module.exports = merge(common, config);
