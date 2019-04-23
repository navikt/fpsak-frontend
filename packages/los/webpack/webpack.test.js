const path = require('path');
const merge = require('webpack-merge');
const commonTest = require('./webpack.common.test.js');

const APP_DIR = path.resolve(__dirname, '../src/client/app');

const config = {
  mode: 'development',
  module: {
  rules: [{
    test: /\.(tsx?|ts?)$/,
    enforce: 'pre',
    loader: 'eslint-loader',
    options: {
      failOnWarning: false,
      failOnError: true,
      configFile: './eslint/eslintrc.test.js',
      fix: false,
       cache: true,
    },
    include: APP_DIR,
    exclude: ['/node_modules/'],
  }, {
    test: /\.(tsx?|ts?)$/,
    use: ['happypack/loader'],
    include: APP_DIR,
    exclude: ['/node_modules/'],
  }],
  },
};

module.exports = merge(commonTest, config);
