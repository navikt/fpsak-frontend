'use strict';
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const PACKAGES_DIR = path.join(__dirname, '../packages');

const config = {
  devtool: 'eval',
  target: 'node', // webpack should compile node compatible code
  module: {
    rules: [
      {
        test: /\.(less|css|jpg|png|svg)$/,
        loader: 'null-loader',
      },
      {
        test: /\.(jsx?|js?|tsx?|ts?)$/,
        include: PACKAGES_DIR,
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
      },
    ],
  },
  plugins: [],
};

module.exports = merge(common, config);
