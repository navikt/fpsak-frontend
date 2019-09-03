"use strict";
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');
const merge = require('webpack-merge');
const commonDevAndProd = require('./webpack.common.dev_and_prod');

const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const APP_DIR = path.resolve(PACKAGES_DIR, 'fpsak/src');

const config = {
  mode: 'production',
  devtool: 'source-map',
  performance: { hints: false },

  entry: [
    '@babel/polyfill',
    APP_DIR + '/index.jsx',
  ],
  output: {
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    path: path.resolve(__dirname, '../dist/public'),
    publicPath: '/fpsak/public/',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  stats: {
    children: false,
  },
};

module.exports = merge(commonDevAndProd, config);
