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
      navAnsatt: path.join(APP_DIR, 'navAnsatt'),
      form: path.join(APP_DIR, 'form'),
      saksbehandler: path.join(APP_DIR, 'saksbehandler'),
      avdelingsleder: path.join(APP_DIR, 'avdelingsleder'),
      data: path.join(APP_DIR, 'data'),
      kodeverk: path.join(APP_DIR, 'kodeverk'),
      sharedComponents: path.join(APP_DIR, 'sharedComponents'),
      utils: path.join(APP_DIR, 'utils'),
    },
    extensions: ['.json', '.js', '.tsx', '.ts'],
  },

  externals: {
    cheerio: 'window',
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react',
  },
};

module.exports = config;
