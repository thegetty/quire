// @ts-check

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");

const PATHS = {
  source: path.join(__dirname, "../source"),
  build: path.join(__dirname, "../static")
};

module.exports = {
  mode: "development",
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 3000
  },
  entry: {
    source: path.join(PATHS.source, "js", "application.js")
  },
  output: {
    path: PATHS.build,
    publicPath: "/",
    filename: path.join("js", "application.js")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, path.join(PATHS.build, "css", "epub.scss")],
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              autoprefixer: {
                browsers: ["last 3 versions"]
              },
              plugins: () => [autoprefixer]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              autoprefixer: {
                browsers: ["last 3 versions"]
              },
              plugins: () => [autoprefixer]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img/"
            }
          }
        ]
      }
    ]
  },
  optimization: {
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
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/application.css",
      chunkFilename: "css/[id].css"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};
