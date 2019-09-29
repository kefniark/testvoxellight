const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [new htmlWebpackPlugin({
    template: "src/index.html"
  })],
  externals: {
    GPU: 'GPU'
  }
};