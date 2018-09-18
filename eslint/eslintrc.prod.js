const merge = require('webpack-merge');
const common = require('./eslintrc.common.js');

var ERROR = 2;

const config = {
  settings: {
    "import/resolver": {
      webpack: {
        config: "webpack/webpack.prod.js",
      },
    },
  },
  
  rules: {
    "no-console": ERROR,
  },
};

module.exports = merge(common, config);
