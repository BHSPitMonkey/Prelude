var webpack = require("webpack");
var childProcess = require("child_process");
module.exports = {
  entry: "./js/entry.jsx",
  devtool: "source-map",
  output: {
    hashFunction: "xxhash64",
    path: __dirname + "/build",
    filename: "bundle.js",
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
  ],
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    }
  }
};
