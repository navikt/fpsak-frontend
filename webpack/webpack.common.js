'use strict';
const path = require('path');
const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const APP_DIR = path.join(PACKAGES_DIR, 'sak-app/src');

const config = {
  resolve: {
    alias: {
      behandlingForstegangOgRevurdering: path.join(PACKAGES_DIR, 'fp-behandling-forstegang-og-revurdering'),
      behandlingInnsyn: path.join(PACKAGES_DIR, 'fp-behandling-innsyn'),
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
