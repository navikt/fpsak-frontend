"use strict";

const HappyPack = require('happypack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const APP_DIR = path.resolve(__dirname, '../src/client/app');

const config = {
  mode: 'development',
  devtool: "eval",
  target: 'node', // webpack should compile node compatible code
  module: {
    rules: [{
	  test: /\.jsx?$/,
	  use: [ 'istanbul-instrumenter-loader', 'happypack/loader' ],
	  include: APP_DIR,
	  exclude: /node_modules/,
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
          presets: [ "react", "env", "stage-0" ],
          cacheDirectory: true,
        }
      }],
	  threads: 4,
	}),
  ],
};

module.exports = merge(common,config);
