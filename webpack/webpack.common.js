"use strict";

const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../src/client');
const APP_DIR = path.join(ROOT_DIR, 'app');

const config = {
  resolve: {
    alias: {
      styles: path.join(ROOT_DIR, 'styles'),
      images: path.join(ROOT_DIR, 'images'),
      testHelpers: path.join(ROOT_DIR, 'testHelpers'),
      app: path.join(APP_DIR, 'app'),
      behandling: path.join(APP_DIR, 'behandling'),
      navAnsatt: path.join(APP_DIR, 'navAnsatt'),
      behandlingmenu: path.join(APP_DIR, 'behandlingmenu'),
      behandlingsprosess: path.join(APP_DIR, 'behandlingsprosess'),
      behandlingsupport: path.join(APP_DIR, 'behandlingsupport'),
      fagsak: path.join(APP_DIR, 'fagsak'),
      fagsakSearch: path.join(APP_DIR, 'fagsakSearch'),
      fagsakprofile: path.join(APP_DIR, 'fagsakprofile'),
      fakta: path.join(APP_DIR, 'fakta'),
      form: path.join(APP_DIR, 'form'),
      person: path.join(APP_DIR, 'person'),
      papirsoknad: path.join(APP_DIR, 'papirsoknad'),
      data: path.join(APP_DIR, 'data'),
      kodeverk: path.join(APP_DIR, 'kodeverk'),
      sharedComponents: path.join(APP_DIR, 'sharedComponents'),
      utils: path.join(APP_DIR, 'utils'),
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
