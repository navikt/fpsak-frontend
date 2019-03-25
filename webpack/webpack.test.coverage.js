const HappyPack = require('happypack');
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const PACKAGE = require('./../package.json');

const VERSION = PACKAGE.version;
const PACKAGES_DIR = path.join(__dirname, '../packages');

const config = {
  mode: 'development',
  devtool: 'eval',
  target: 'node', // webpack should compile node compatible code
  module: {
    rules: [{
  	  test: /\.(tsx?|ts?|jsx?)$/,
      use: [{
        loader: 'istanbul-instrumenter-loader',
        options: { esModules: true }
      }, {
        loader: 'happypack/loader',
      }],
  	  include: PACKAGES_DIR,
  	  exclude: /(node_modules)/,
    }, {
  	  test: /\.(less|css|jpg|png|svg)$/,
  	  loader: 'null-loader',
    }],
  },
  plugins: [
    new HappyPack({
      loaders: [{
        path: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      }],
      threads: 4,
    }),
     new webpack.DefinePlugin({
      VERSION: JSON.stringify(VERSION),
    }),
  ],
};

module.exports = merge(common, config);
