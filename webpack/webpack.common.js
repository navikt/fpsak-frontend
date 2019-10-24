'use strict';
const path = require('path');
const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const APP_DIR = path.join(PACKAGES_DIR, 'fpsak/src');

//TODO (TOR) Dette må delast opp og flyttast inn i kvar pakke.
const config = {

  resolve: {
    alias: {
      //Burde kun brukast av pakke fpsak
      aktoer: path.join(APP_DIR, 'aktoer'),
      app: path.join(APP_DIR, 'app'),
      behandling: path.join(APP_DIR, 'behandling'),
      behandlingmenu: path.join(APP_DIR, 'behandlingmenu'),
      behandlingsupport: path.join(APP_DIR, 'behandlingsupport'),
      data: path.join(APP_DIR, 'data'),
      fagsak: path.join(APP_DIR, 'fagsak'),
      fagsakprofile: path.join(APP_DIR, 'fagsakprofile'),
      fagsakSearch: path.join(APP_DIR, 'fagsakSearch'),
      kodeverk: path.join(APP_DIR, 'kodeverk'),
      person: path.join(APP_DIR, 'person'),
      tidslinje: path.join(APP_DIR, 'tidslinje'),

      //Andre pakker
      behandlingForstegangOgRevurdering: path.join(PACKAGES_DIR, 'fp-behandling-forstegang-og-revurdering'),
      behandlingTilbakekreving: path.join(PACKAGES_DIR, 'fp-behandling-tilbakekreving'),
      behandlingInnsyn: path.join(PACKAGES_DIR, 'fp-behandling-innsyn'),
      behandlingKlage: path.join(PACKAGES_DIR, 'fp-behandling-klage'),
      behandlingAnke: path.join(PACKAGES_DIR, 'fp-behandling-anke'),
      papirsoknad: path.join(PACKAGES_DIR, 'fp-behandling-papirsoknad'),
    },
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'],
  },

  externals: {
    canvas: 'commonjs canvas',
    cheerio: 'window',
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react',
    bufferutil: 'bufferutil',
    'utf-8-validate': 'utf-8-validate',
  },
};

module.exports = config;
