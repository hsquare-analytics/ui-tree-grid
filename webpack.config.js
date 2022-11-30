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
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
        query: {
          presets: ['react'],
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
