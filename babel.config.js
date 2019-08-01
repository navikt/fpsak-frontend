/* eslint-disable no-console */
const { NODE_ENV, BABEL_ENV } = process.env;

module.exports = function (api) {
  // eslint-disable-next-line no-unused-expressions
  api ? api.cache(true) : null;
  const presets = [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-typescript',
  ];
  const plugins = ['@babel/plugin-proposal-class-properties'];


  if (NODE_ENV && BABEL_ENV && NODE_ENV !== BABEL_ENV) {
    console.warn('WARNING: Both BABEL_ENV and NODE_ENV are set in');
    console.warn('WARNING: the environment, but with different values.');
    console.warn(`WARNING: BABEL_ENV = ${BABEL_ENV}`);
    console.warn(`WARNING: NODE_ENV = ${NODE_ENV}`);
  }

  if (NODE_ENV === 'coverage' || BABEL_ENV === 'coverage') {
    plugins.push('istanbul');
    process.env.NODE_ENV = 'coverage';
    process.env.BABEL_ENV = 'coverage';
  }

  return {
    presets,
    plugins,
  };
};
