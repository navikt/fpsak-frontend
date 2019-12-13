'use strict';
require('dotenv')
  .config();
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev');
const vtpLogin = require('./mocks/login');
const sentryMock = require('./mocks/sentry');
const featureToggles = require('./mocks/feature-toggles');
const fakeError = require('./mocks/fake-error');
if (process.argv.includes('--no-fix')) {
  console.warn('Setting eslint-loader option \'fix\' to false');
  config.module.rules.find(rules => rules.loader === 'eslint-loader').options.fix = false;
}

const options = {
  contentBase: [
    'packages',
  ],
  watchContentBase: true,
  before: function (app, server) {
    vtpLogin(app);
    sentryMock(app);
    fakeError(app);
    if (process.argv.includes('--feature-toggles')) {
      console.warn('Mocking feature toggles');
      featureToggles(app);
    }
  },
  proxy: {
    '/fpoppdrag/**': {
      target: process.env.APP_URL_FPOPPDRAG || 'http://localhost:8070',
      secure: false,
      changeOrigin: (!!process.env.APP_URL_FPOPPDRAG),
    },
    '/fptilbake/**': {
      target: process.env.APP_URL_FPTILBAKE || 'http://localhost:8030',
      secure: false,
      changeOrigin: (!!process.env.APP_URL_FPTILBAKE),
    },
    '/fpformidling/**': {
      target: process.env.APP_URL_FPFORMIDLING || 'http://localhost:8010',
      secure: false,
      changeOrigin: (!!process.env.APP_URL_FPFORMIDLING),
    },
    '/fpsak/**': {
      target: process.env.APP_URL_FPSAK || 'http://localhost:8080',
      secure: false,
      changeOrigin: (!!process.env.APP_URL_FPSAK),
      onProxyRes: function onProxyRes(proxyRes, req, res) {
        // For å håndtere redirects på 202 Accepted responser med location headers...
        if (proxyRes.headers.location && proxyRes.headers.location.startsWith(process.env.APP_URL_FPSAK)) {
          proxyRes.headers.location = proxyRes.headers.location.split(process.env.APP_URL_FPSAK)[1];
        }
        if(proxyRes.statusCode === 401) {
          proxyRes.headers.location = '/fpsak/resource/login'
        }
      },
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

const wds = new WebpackDevServer(webpack(config), options);

wds.listen(9000, 'localhost', function (err) {
  if (err) {
    return console.log(err); // NOSONAR
  }
  console.log('Listening at http://localhost:9000/');

  console.log('If running agains VTP you can login or change user here: http://localhost:9000/login-with-vtp');
});
