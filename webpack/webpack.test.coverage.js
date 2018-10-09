const HappyPack = require('happypack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const PACAKGES_DIR = path.join(__dirname, '../packages');
const config = {
  mode: 'development',
  devtool: 'eval',
  target: 'node', // webpack should compile node compatible code
  module: {
    rules: [{
	  test: /\.jsx?$/,
	  use: ['istanbul-instrumenter-loader', 'happypack/loader'],
	  include: PACAKGES_DIR,
	  exclude: /(node_modules|testHelpers)/,
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
          presets: ['react', 'env', 'stage-0'],
          cacheDirectory: true,
        },
      }],
	  threads: 4,
    }),
  ],
};

module.exports = merge(common, config);
