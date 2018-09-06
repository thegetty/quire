const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtraneousFileCleanupPlugin = require('webpack-extraneous-file-cleanup-plugin')

const PATHS = {
  source: path.join(__dirname, '../source'),
  build: path.join(__dirname, '../static')
}

module.exports = {
  mode: 'none',
  entry: {
    // `source/js/epub.js` is the entry point for everything;
    // the require('../css/epub.scss') in this file is important.
    source: path.join(PATHS.source, 'js', 'epub.js')
  },
  // Hugo expects everything to be output to the `/static` directory of the theme
  output: {
    path: PATHS.build
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
      test: /\.(scss|css)$/,
      use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
    },
    // file-loader(for images)
    {
      test: /\.(jpg|png|gif|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: './img/'
        }
      }]
    },
    // file-loader(for fonts)
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: './fonts/'
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
      })
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
      filename: "css/epub.css",
    }),
    new ExtraneousFileCleanupPlugin({
      extensions: ['.js'],
      paths: [path.join(__dirname,'../static/')]
    }),
    // Shims for global libs (ex. jquery)
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
  ]
}