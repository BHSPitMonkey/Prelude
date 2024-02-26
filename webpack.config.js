const childProcess = require("child_process");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require("webpack");

module.exports = {
  entry: "./js/entry.jsx",
  devtool: "source-map",
  devServer: {
    static: './build',
  },
  optimization: {
    runtimeChunk: 'single',
  },
  output: {
    hashFunction: "xxhash64",
    path: __dirname + "/build",
    filename: "[name].js",
    sourceMapFilename: "[file].map",
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __BUILD__: JSON.stringify(
        childProcess.execSync("git rev-parse --short HEAD").toString().trim()
      ),
    }),
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
  ],
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    }
  }
};
