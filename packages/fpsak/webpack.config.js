const merge = require('webpack-merge');
const webpackConf = require('../../webpack/webpack.prod');
const path = require('path');
webpackConf.entry = [
  'babel-polyfill',
  `${__dirname}/src/index.jsx`,
];
webpackConf.output.path = path.resolve(__dirname, 'dist/public');

module.exports = webpackConf;
