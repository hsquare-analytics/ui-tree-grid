module.exports = function (api) {
  api.cache(true);

  const presets = ['@babel/preset-env', '@babel/preset-react', { runtime: 'automatic' }, '@babel/preset-typescript'];
  const plugins = ['macros'];

  return {
    presets,
    plugins,
  };
};
