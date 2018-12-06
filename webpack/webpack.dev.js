const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const PACKAGE = require('./../package.json');
const VERSION = PACKAGE.version;

const commonDevAndProd = require('./webpack.common.dev_and_prod.js');

const ROOT_DIR = path.resolve(__dirname, '../public/client');
const PACKAGES_DIR = path.join(__dirname, '../packages');
const APP_DIR = path.resolve(PACKAGES_DIR, 'fpsak/src');

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
    path: ROOT_DIR,
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: path.join(ROOT_DIR, 'favicon.ico'),
      template: path.join(ROOT_DIR, 'index.html'),
      version: VERSION,

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
