const path = require('path');
const merge = require('webpack-merge');
const commonTest = require('./webpack.common.test.js');
const PACAKGES_DIR = path.join(__dirname, '../packages');
const config = {
  mode: 'development',
  module: {
    rules: [{
	  test: /\.jsx?$/,
	  enforce: 'pre',
	  loader: 'eslint-loader',
	  options: {
        failOnWarning: false,
        failOnError: false,
        configFile: './eslint/eslintrc.test.watch.js',
        fix: true,
        cache: true,
	  },
      include: [PACAKGES_DIR],
	  exclude: ['/node_modules/, /assets/'],
    }, {
	  test: /\.jsx?$/,
	  use: ['happypack/loader'],
      include: [PACAKGES_DIR],
	  exclude: ['/node_modules/'],
    }],
  },
};

module.exports = merge(commonTest, config);
