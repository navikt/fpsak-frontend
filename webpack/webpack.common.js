'use strict';
const path = require('path');

const PACKAGE_DIR = path.resolve(__dirname, '../packages');
const APP_DIR = path.join(PACKAGE_DIR, 'fpsak/src');

const config = {
  resolve: {
    alias: {
      app: path.join(APP_DIR, 'app'),
      behandling: path.join(APP_DIR, 'behandling'),
      behandlingmenu: path.join(APP_DIR, 'behandlingmenu'),
      behandlingsprosess: path.join(APP_DIR, 'behandlingsprosess'),
      behandlingsupport: path.join(APP_DIR, 'behandlingsupport'),
      fagsak: path.join(APP_DIR, 'fagsak'),
      fagsakSearch: path.join(APP_DIR, 'fagsakSearch'),
      person: path.join(APP_DIR, 'person'),
      fagsakprofile: path.join(APP_DIR, 'fagsakprofile'),
      fakta: path.join(APP_DIR, 'fakta'),
    },
    extensions: ['.json', '.js', '.jsx'],
  },

  externals: {
    cheerio: 'window',
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react',
  },
};

module.exports = config;
