module.exports = {
  entry: './server.js',
  output: {
    filename: 'compiled.js',
  },
  resolve: {
    extensions: ['ts', 'tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
