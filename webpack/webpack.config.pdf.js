const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const autoprefixer = require("autoprefixer");

const PATHS = {
  source: path.join(__dirname, "../source"),
  build: path.join(__dirname, "../static")
};

const ASSET_PATH = process.env.ASSET_PATH || "../";

module.exports = {
  mode: "production",
  entry: {
    source: path.join(PATHS.source, "js", "application.js")
  },
  output: {
    path: PATHS.build,
    publicPath: ASSET_PATH,
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
      }),
      new OptimizeCSSAssetsPlugin({})
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
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/application.css"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};
