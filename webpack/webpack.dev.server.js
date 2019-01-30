"use strict";
require('dotenv').config()
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev');

if (process.argv.includes('--no-fix')) {
  console.warn("Setting eslint-loader option 'fix' to false");
  config.module.rules.find(rules => rules.loader === 'eslint-loader').options.fix = false;
}

var options = {
  contentBase: [
    'packages',
  ],
  watchContentBase: true,
  proxy: {
    "/fpoppdrag/**": {
      target: process.env.APP_URL_FPOPPDRAG || "http://localhost:8070",
      secure: false,
      changeOrigin: true,
    },
    "/fptilbake/**": {
      target: process.env.APP_URL_FPTILBAKE || "http://localhost:8030",
      secure: false,
      changeOrigin: true,
    },
    "/fpsak/(api|jetty)/**": {
      target: process.env.APP_URL_FPSAK || "http://localhost:8080",
      secure: false,
      changeOrigin: true,
    },
  },
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: true,
  historyApiFallback: true,
  stats: {
    children: false,
    colors: true,
  },
};

var wds = new WebpackDevServer(webpack(config), options);

wds.listen(9000, 'localhost', function(err) {
  if (err) {
    return console.log(err); // NOSONAR
  }

  console.log('Listening at http://localhost:9000/');
});
