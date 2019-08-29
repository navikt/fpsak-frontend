const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const commonDevAndProd = require('./webpack.common.dev_and_prod.js');

const ROOT_DIR = path.resolve(__dirname, '../public/client');
const PACKAGES_DIR = path.join(__dirname, '../packages');
const APP_DIR = path.resolve(PACKAGES_DIR, 'fpsak/src');
const isDevelopment = JSON.stringify(process.env.NODE_ENV) === '"development"';
const PUBLIC_PATH = isDevelopment ? 'fpsak/public/' : '';
const config = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: [
    '@babel/polyfill',
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    APP_DIR + '/index.jsx',
  ],
  output: {
    path: ROOT_DIR,
    publicPath: '/',
    filename: '[name].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{
        from: path.join(__dirname, '../public/appdynamics/dummy.js'),
        to: PUBLIC_PATH + 'eum.min.js',
        force: true,
        cache: {
          key: '[hash]',
        },
      }]),
  ],
  optimization: {
    namedModules: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    historyApiFallback: true,
  },
};

module.exports = merge(commonDevAndProd, config);
