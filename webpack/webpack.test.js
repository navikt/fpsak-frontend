const path = require('path');
const merge = require('webpack-merge');
const commonTest = require('./webpack.common.test.js');

const PACAKGES_DIR = path.join(__dirname, '../packages');
const config = {
  mode: 'development',
  module: {
    rules: [{
	  test: /\.spec.jsx?$/,
	  enforce: 'pre',
	  loader: 'eslint-loader',
	  options: {
        failOnWarning: false,
        failOnError: true,
        configFile: path.resolve(__dirname, '../eslint/eslintrc.test.js'),
        fix: false,
        cache: true,
	  },
      include: [PACAKGES_DIR],
	  exclude: ['/node_modules/, /assets/'],
    }, {
	  test: /\.jsx?$/,
	  use: ['happypack/loader'],
      include: [PACAKGES_DIR],
	  exclude: ['/node_modules/, /assets/'],
    }],
  },
};

module.exports = merge(commonTest, config);
