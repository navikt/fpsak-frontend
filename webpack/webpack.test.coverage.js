const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.test.js');
const PACKAGE = require('./../package.json');
const PACKAGES_DIR = path.join(__dirname, '../packages');
const config = {
  mode: 'development',
  devtool: 'eval',
  target: 'node', // webpack should compile node compatible code
  module: {
    rules: [
      {
        test: /\.(less|css|jpg|png|svg)$/,
        loader: 'null-loader',
      },
      {
        test: /\.(jsx?|js?|tsx?|ts?)$/,
        include: PACKAGES_DIR,
        enforce: 'post', // needed if you're using Babel
        loader: 'istanbul-instrumenter-loader',
        options: {
          esModules: true, // needed if you're using Babel
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(PACKAGE.version),
    }),
  ],
};

module.exports = merge(common, config);
