const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const PATHS = {
  source: path.join(__dirname, "lib"),
  build: path.join(__dirname, "bin")
};

module.exports = {
  mode: "production",
  entry: {
    source: "./index.js"
  },
  output: {
    path: PATHS.build,
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            inline: false
          }
        }
      })
    ],
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor_app",
          chunks: "all",
          minChunks: 2
        }
      }
    }
  }
};
