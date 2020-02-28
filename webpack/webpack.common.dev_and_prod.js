'use strict';
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const PACKAGE = require('./../package.json');
const VERSION = PACKAGE.version;

const ROOT_DIR = path.resolve(__dirname, '../public/client');
const CORE_DIR = path.resolve(__dirname, '../node_modules');
const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const LANG_DIR = path.resolve(__dirname, '../public/sprak/');
const CSS_DIR = path.join(PACKAGES_DIR, 'assets/styles');
const IMAGE_DIR = path.join(PACKAGES_DIR, 'assets/images');

const isDevelopment = JSON.stringify(process.env.NODE_ENV) === '"development"';
const PUBLIC_PATH = isDevelopment ? 'fpsak/public/' : '';

const config = {
  module: {
    rules: [
      {
        test: /\.(tsx?|ts?|jsx?)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: !isDevelopment,
          configFile: path.resolve(__dirname, isDevelopment ? '../eslint/eslintrc.dev.js' : '../eslint/eslintrc.prod.js'),
          fix: isDevelopment,
          cache: true,
        },
        include: [PACKAGES_DIR],
      }, {
        test: /\.(jsx?|js?|tsx?|ts?)$/,
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'thread-loader',
            options: {
              workers: process.env.CIRCLE_NODE_TOTAL || require('os')
                .cpus() - 1,
              workerParallelJobs: 50,
            },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
        include: PACKAGES_DIR,
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
              localIdentName: '[name]_[local]_[contenthash:base64:5]',
            },
          }, {
            loader: 'less-loader',
            options: {
              modules: true,
              localIdentName: '[name]_[local]_[contenthash:base64:5]',
              modifyVars: {
                nodeModulesPath: '~',
                coreModulePath: '~',
              },
            },
          }],
        include: [PACKAGES_DIR],
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
          }],
        include: [CSS_DIR, CORE_DIR],
      }, {
        test: /\.(svg)$/,
        issuer: {
          test: /\.less?$/
        },
        loader: 'file-loader',
        options: {
          esModule: false,
          name: isDevelopment ? '[name]_[hash].[ext]' : '/[name]_[hash].[ext]',
        },
        include: [IMAGE_DIR],
      }, {
        test: /\.(svg)$/,
        issuer: {
          test: /\.(jsx|tsx)?$/
        },
        use: [{
          loader: '@svgr/webpack',
        },{
          loader: 'file-loader',
          options: {
            esModule: false,
            name: isDevelopment ? '[name]_[hash].[ext]' : '/[name]_[hash].[ext]',
          },
        }],
        include: [IMAGE_DIR],
      },{
        test: /\.(svg)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: isDevelopment ? '[name]_[hash].[ext]' : '/[name]_[hash].[ext]',
        },
        include: [CORE_DIR],
      }],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? 'style.css' : 'style_[contenthash].css',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      filename: isDevelopment ? 'index.html' : '../index.html',
      favicon: path.join(ROOT_DIR, 'favicon.ico'),
      template: path.join(ROOT_DIR, 'index.html'),
      version: VERSION,
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(VERSION),
    }),
    new CopyWebpackPlugin([
      {
        from: LANG_DIR,
        to: PUBLIC_PATH + 'sprak/[name].[ext]',
        force: true,
        cache: {
          key: '[hash]',
        },
      }
    ]),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /nb/,
    ),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
  ],
};

module.exports = merge(common, config);
