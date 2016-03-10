var webpack = require('webpack');
var childProcess = require('child_process');
module.exports = {
  entry: "./js/entry.jsx",
  devtool: "#source-map",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js",
    sourceMapFilename: "[file].map"
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['react', 'es2015']
      }
    }, {
      test: /\.css$/,
      loader: "style!css"
    }]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __BUILD__: JSON.stringify(childProcess.execSync('git rev-parse --short HEAD').toString().trim())
    })
  ]
};
