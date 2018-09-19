const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const PATHS = {
  source: path.join(__dirname, '../source'),
  build: path.join(__dirname, '../static')
}

// the path(s) that should be cleaned
let pathsToClean = [
  path.join(PATHS.build, 'js', 'source.js'),
  '../../../site/source.js',
  '../../../site/js/source.js',
  path.join(PATHS.build, 'css', 'epub.css')
]

// the clean options to use
let cleanOptions = {
  verbose: false,
  dry: false,
  watch: true,
  allowExternal: true,
  beforeEmit: false
}

module.exports = {
  mode: 'production',
  entry: {
    source: path.join(PATHS.source, 'js', 'epub.js')
  },
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
      exclude: /node_modules/,
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
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
  ]
}