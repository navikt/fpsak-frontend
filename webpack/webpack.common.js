'use strict';
const path = require('path');
const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const APP_DIR = path.join(PACKAGES_DIR, 'sak-app/src');

const config = {
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.less'],
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
