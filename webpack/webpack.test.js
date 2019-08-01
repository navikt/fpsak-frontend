const path = require('path');
const merge = require('webpack-merge');
const commonTest = require('./webpack.common.test.js');

const PACKAGES_DIR = path.join(__dirname, '../packages');
const ESLINT_CONFIG_DIR = path.resolve(__dirname, '../eslint/eslintrc.test.js');

const config = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(tsx?|ts?|jsx?)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          failOnWarning: true,
          failOnError: true,
          configFile: ESLINT_CONFIG_DIR,
          fix: false,
          cache: true,
        },
        include: [PACKAGES_DIR],
      }],
  },
};

module.exports = merge(commonTest, config);
