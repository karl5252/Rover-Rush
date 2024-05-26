const path = require('path');

module.exports = {
  entry: './netlify/functions/leaderboard.js',
  target: 'node',
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
  }
};
