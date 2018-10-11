const merge = require('webpack-merge');
const common = require('./eslintrc.common.js');
const path = require('path');
const ERROR = 2;

const config = {
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname,'../webpack/webpack.prod.js'),
      },
    },
  },

  rules: {
    'no-console': ERROR,
  },
};

module.exports = merge(common, config);
