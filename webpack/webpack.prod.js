"use strict";

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const commonDevAndProd = require('./webpack.common.dev_and_prod.js');

const ROOT_DIR = path.resolve(__dirname, '../src/client');
const APP_DIR = path.resolve(ROOT_DIR, 'app');

//Fjern de to utkommenterte linjene for sourcemaps i produksjonsbygget.

const config = {
  mode: 'production',
  //devtool: 'source-maps',
  performance: { hints: false },

  entry: [
    'babel-polyfill', 
    APP_DIR + '/index.jsx'
  ],
  
  output: {
	  filename: 'bundle-[hash].js',
	  path: path.resolve(__dirname, '../target/public'),
	  publicPath: 'public',
  },

  plugins: [
    new HtmlWebpackPlugin({
	    filename: '../index.html',
	    template:path.join(ROOT_DIR, 'index.html'),
    }),
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false,
        },
        parallel: true,
        cache: true,
        //sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ]
  },

  stats: {
    children: false,
  },
};

module.exports = merge(commonDevAndProd, config);
