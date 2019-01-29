"use strict";

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const commonDevAndProd = require('./webpack.common.dev_and_prod.js');

const ROOT_DIR = path.resolve(__dirname, '../public/client');
const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const APP_DIR = path.resolve(PACKAGES_DIR, 'fpsak/src');

const config = {
  mode: 'production',
  devtool: 'source-map',
  performance: { hints: false },

  entry: [
    'babel-polyfill',
    APP_DIR + '/index.jsx',
  ],
  output: {
    filename: 'bundle-[hash].js',
    path: path.resolve(__dirname, '../dist/public'),
    publicPath: '/fpsak/public',
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false,
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  stats: {
    children: false,
  },
};

module.exports = merge(commonDevAndProd, config);
