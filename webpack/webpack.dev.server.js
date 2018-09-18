"use strict";

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev');

if (process.argv.includes('--no-fix')) {
  console.warn("Setting eslint-loader option 'fix' to false");
  config.module.rules.find(rules => rules.loader === 'eslint-loader').options.fix = false;
}

var options = {
  contentBase: "src/client",
  proxy: {
    "**/(sprak|api)/**": {
      target: "http://localhost:8080",
      secure: false,
    },
  },
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: true,
  historyApiFallback: false,
  stats: {
    children: false,
    colors: true,
  },
};

var wds = new WebpackDevServer(webpack(config), options);

wds.listen(9000, 'localhost', function(err) {
  if (err) {
	  return console.log(err); //NOSONAR
  }

  console.log('Listening at http://localhost:9000/');
});
