//@ts-check

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ImageminPlugin = require("imagemin-webpack");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");

const PATHS = {
  source: path.join(__dirname, '../source'),
  build: path.join(__dirname, '../static')
};

// the path(s) that should be cleaned
const pathsToClean = [
  path.join(PATHS.build, 'js', 'source.js'),
  '../../../site/source.js',
  '../../../site/js/source.js',
  path.join(PATHS.build, 'css', 'epub.css')
];

// the clean options to use
let cleanOptions = {
  verbose: false,
  watch: false,
  allowExternal: true
};

module.exports = {
  mode: 'none',
  entry: {
    source: path.join(PATHS.source, 'js', 'epub.js')
  },
  output: {
    path: PATHS.build,
    publicPath: "/"
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, path.join(PATHS.build, 'css', 'application.scss')],
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                browsers: ['last 3 versions']
              },
              plugins: () => [
                autoprefixer
              ]
            }
          }, 'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                browsers: ['last 3 versions']
              },
              plugins: () => [
                autoprefixer
              ]
            }
          }, 'sass-loader'
        ]
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
      filename: 'css/epub.css'
    }),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
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
          })
        ]
      }
    })
  ]
};