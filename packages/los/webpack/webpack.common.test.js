const HappyPack = require('happypack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const config = {
  devtool: 'eval',
  target: 'node', // webpack should compile node compatible code

  module: {
    rules: [{
    test: /\.(less|css|jpg|png|svg)$/,
    loader: 'null-loader',
  }],
  },

  plugins: [
    new HappyPack({
      loaders: [{
        path: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      }],
      threads: 4,
    }),
  ],
};

module.exports = merge(common, config);
