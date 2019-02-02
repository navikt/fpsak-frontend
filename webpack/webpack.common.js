'use strict';
const path = require('path');

const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const APP_DIR = path.join(PACKAGES_DIR, 'fpsak/src');

//TODO (TOR) Dette må delast opp og flyttast inn i kvar pakke.
const config = {
  resolve: {
    alias: {
      //Burde kun brukast av pakke fpsak
      app: path.join(APP_DIR, 'app'),
      aktoer: path.join(APP_DIR, 'aktoer'),
      behandling: path.join(APP_DIR, 'behandling'),
      behandlingFpsak: path.join(APP_DIR, 'behandlingFpsak'),
      behandlingmenu: path.join(APP_DIR, 'behandlingmenu'),
      behandlingsupport: path.join(APP_DIR, 'behandlingsupport'),
      fagsak: path.join(APP_DIR, 'fagsak'),
      fagsakSearch: path.join(APP_DIR, 'fagsakSearch'),
      person: path.join(APP_DIR, 'person'),
      fagsakprofile: path.join(APP_DIR, 'fagsakprofile'),
      kodeverk: path.join(APP_DIR, 'kodeverk'),
      navAnsatt: path.join(APP_DIR, 'navAnsatt'),
      data: path.join(APP_DIR, 'data'),

      //Andre pakker
      papirsoknad: path.join(PACKAGES_DIR, 'fp-behandling-papirsoknad'),
      behandlingTilbakekreving: path.join(PACKAGES_DIR, 'fp-behandling-tilbakekreving'),
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
