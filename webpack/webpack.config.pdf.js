const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const autoprefixer = require("autoprefixer")
const ImageminPlugin = require("imagemin-webpack")
const imageminGifsicle = require("imagemin-gifsicle")
const imageminJpegtran = require("imagemin-jpegtran")
const imageminOptipng = require("imagemin-optipng")
const imageminSvgo = require("imagemin-svgo")

const PATHS = {
  source: path.join(__dirname, '../source'),
  build: path.join(__dirname, '../static')
}

module.exports = {
  mode: 'development',
  entry: {
    source: path.join(PATHS.source, 'js', 'application.js')
  },
  output: {
    path: PATHS.build,
    publicPath: "/",
    filename: path.join('js', 'application.js')
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, path.join(PATHS.build, 'css', 'epub.scss')],
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader',
          {
            loader: "postcss-loader",
            options: {
              autoprefixer: {
                browsers: ["last 3 versions"]
              },
              plugins: () => [
                autoprefixer
              ]
            },
          }, 'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader',
          {
            loader: "postcss-loader",
            options: {
              autoprefixer: {
                browsers: ["last 2 versions"]
              },
              plugins: () => [
                autoprefixer
              ]
            },
          }, 'sass-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'img/'
          }
        }]
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
          name: 'vendor_app',
          chunks: 'all',
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
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebpackPlugin(),
    new HTMLInlineCSSWebpackPlugin(),
    // Make sure that the plugin is after any plugins that add images, example `CopyWebpackPlugin`
    new ImageminPlugin({
      bail: false, // Ignore errors on corrupted images
      cache: true,
      imageminOptions: {
        // Lossless optimization with custom option
        // Feel free to experement with options for better result for you
        plugins: [
          imageminGifsicle({
            interlaced: true
          }),
          imageminJpegtran({
            progressive: true
          }),
          imageminOptipng({
            optimizationLevel: 5
          }),
          imageminSvgo({
            removeViewBox: true
          })
        ]
      }
    })
  ]
}