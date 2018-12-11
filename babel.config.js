module.exports = function(api) {
  api.cache(false);
  const presets = ['@babel/react', ['@babel/env', { modules: false }], '@babel/flow'];
  const plugins = ['react-hot-loader/babel', '@babel/plugin-proposal-class-properties'];

  return {
    presets,
    plugins,
  };
};
