"use strict";

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const commonDevAndProd = require('./webpack.common.dev_and_prod.js');

const ROOT_DIR = path.resolve(__dirname, '../src/client');
const APP_DIR = path.resolve(ROOT_DIR, 'app');

const config = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  
  entry: [
   'babel-polyfill',
   'webpack-dev-server/client?http://localhost:9000',
   'webpack/hot/only-dev-server',
    APP_DIR + '/index.jsx',
  ],
  
  output: {
	  filename: 'bundle.js',
    path: ROOT_DIR,
    publicPath: "/",
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(ROOT_DIR, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  optimization: {
    namedModules: true,
  },

  devServer: {
    historyApiFallback: true,
  },
};

module.exports = merge(commonDevAndProd, config);
