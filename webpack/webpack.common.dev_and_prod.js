'use strict';
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const CORE_DIR = path.resolve(__dirname, '../node_modules');
const PACAKGES_DIR = path.join(__dirname, '../packages');
const i18n_DIR = path.join(__dirname, '../public/sprak/');
const CSS_DIR = path.join(PACAKGES_DIR, 'assets/styles');
const APP_DIR = path.join(PACAKGES_DIR, 'app');

const isDevelopment = JSON.stringify(process.env.NODE_ENV) === '"development"';

const config = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: !isDevelopment,
          configFile: path.resolve(__dirname, isDevelopment ? '../eslint/eslintrc.dev.js' : '../eslint/eslintrc.prod.js'),
          fix: isDevelopment,
          cache: true,
        },
        include: [APP_DIR, PACAKGES_DIR],
      }, {
        test: /\.(jsx?|js?)$/,
        loader: 'babel-loader',
        options: {
          presets: ['react', ['env', { modules: false }], 'stage-0'],
          cacheDirectory: true,
        },
        include: [APP_DIR, PACAKGES_DIR],
      }, {
        test: /\.(less|css)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: isDevelopment ? './' : '.',
            },
          }, {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          }, {
            loader: 'less-loader',
            options: {
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
              modifyVars: {
                nodeModulesPath: '~',
                coreModulePath: '~',
              },
            },
          },
        ],
        include: [APP_DIR, PACAKGES_DIR],
        exclude: [CSS_DIR],
      }, {
        test: /\.(less|css)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: isDevelopment ? './' : '.',
            },
          }, {
            loader: 'css-loader',
          }, {
            loader: 'less-loader',
            options: {
              modifyVars: {
                nodeModulesPath: '~',
                coreModulePath: '~',
              },
            },
          },
        ],
        include: [CSS_DIR, CORE_DIR],
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: isDevelopment ? '[name]_[hash].[ext]' : '/[name]_[hash].[ext]',
        },
        include: [PACAKGES_DIR],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? 'style.css' : 'style_[hash].css',
    }),
    new CopyWebpackPlugin([
      {
        from: i18n_DIR,
        to: 'sprak',
        toType: 'dir',
      },
    ]),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /nb/
    ),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
  ],
};

module.exports = merge(common, config);
