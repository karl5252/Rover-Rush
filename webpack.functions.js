const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './netlify/functions/leaderboard.js',
  target: 'node',
  mode: 'production', // Set the mode explicitly
  externals: [nodeExternals()], // Add this line to exclude node_modules
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-nullish-coalescing-operator',
              '@babel/plugin-proposal-optional-chaining'
            ]
          }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'netlify/functions-build'),
    filename: 'leaderboard.js'
  },
  resolve: {
    extensions: ['.js'],
    fallback: {
      fs: false,
      net: false,
      tls: false,
    }
  }
};
