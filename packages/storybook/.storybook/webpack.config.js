const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PACKAGES_DIR = path.resolve(__dirname, '../../../packages');
const CORE_DIR = path.resolve(__dirname, '../../../node_modules');
const IMAGE_DIR = path.join(PACKAGES_DIR, 'assets/images');
const CSS_DIR = path.join(PACKAGES_DIR, 'assets/styles');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  //Fjern default svg-loader
  config.module.rules = config.module.rules.map(data => {
    if (/svg\|/.test(String(data.test))) {
      data.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;
    }
    return data;
  });

  config.devtool = 'cheap-module-eval-source-map';

  // Make whatever fine-grained changes you need
  config.module.rules = config.module.rules.concat(
    {
      test: /\.(tsx?|ts?|jsx?)$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      options: {
        failOnWarning: false,
        failOnError: false,
        configFile: path.resolve(__dirname, '../../../eslint/eslintrc.dev.js'),
        fix: true,
        cache: true,
      },
      include: [PACKAGES_DIR],
    },
    {
      test: /\.(jsx?|js?|tsx?|ts?)$/,
      use: [
        { loader: 'cache-loader' },
        {
          loader: 'thread-loader',
          options: {
            workers: process.env.CIRCLE_NODE_TOTAL || require('os').cpus() - 1,
            workerParallelJobs: 50,
          },
        },
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      ],
      include: PACKAGES_DIR,
    },
    {
      test: /\.(less|css)?$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: './',
          },
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: '[name]_[local]_[contenthash:base64:5]',
          },
        },
        {
          loader: 'less-loader',
          options: {
            modules: true,
            localIdentName: '[name]_[local]_[contenthash:base64:5]',
            modifyVars: {
              nodeModulesPath: '~',
              coreModulePath: '~',
            },
          },
        },
      ],
      include: [PACKAGES_DIR],
      exclude: [CSS_DIR],
    },
    {
      test: /\.(less)?$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: './',
          },
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'less-loader',
          options: {
            modifyVars: {
              nodeModulesPath: '~',
              coreModulePath: '~',
            },
          },
        },
      ],
      include: [CSS_DIR, CORE_DIR],
    },
    {
      test: /\.(jpg|png|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name]_[hash].[ext]',
      },
      include: [IMAGE_DIR],
    },
  );

  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  );
  config.resolve.extensions.push('.ts', '.tsx');

  // Return the altered config
  return config;
};
