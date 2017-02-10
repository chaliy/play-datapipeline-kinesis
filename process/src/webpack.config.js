const path = require('path');

module.exports = {
  entry: [
    './index'
  ],
  externals: [
    'aws-sdk'
  ],
  output: {
    path: path.join(__dirname, '../dist'),
    libraryTarget: 'commonjs2',
    filename: 'index.js'
  },
  target: 'node',
  module: { loaders: [ /* ... */ ] }
};