var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev');

if (process.argv.includes('--no-fix')) {
  console.warn("Setting eslint-loader option 'fix' to false");
  config.module.rules.find(rules => rules.loader === 'eslint-loader').options.fix = false;
}

const options = {
  contentBase: 'src/client',
  proxy: {
    '**/(sprak|api)/**': {
      target: 'http://localhost:8070',
      secure: false,
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

wds.listen(9100, 'localhost', (err) => {
  if (err) {
    return console.log(err); // NOSONAR
  }

  console.log('Listening at http://localhost:9100/');
  return null;
});
