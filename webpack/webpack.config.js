const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const PATHS = {
  source: path.join(__dirname, '../source'),
  build: path.join(__dirname, '../static')
}

module.exports = {
  mode: 'production',
  entry: {
    // `source/js/application.js` is the entry point for everything;
    // the require('../css/application.scss') in this file is important.
    source: path.join(PATHS.source, 'js', 'application.js')
  },
  // Hugo expects everything to be output to the `/static` directory of the theme
  output: {
    path: PATHS.build,
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
      use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
    },
    {
      test: /\.css$/,
      use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
    },
    // file-loader(for images)
    {
      test: /\.(jpg|png|gif|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/img/'
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
          outputPath: '/fonts/'
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
      filename: "css/application.css",
    }),
    // Experimental: Enable to dramatically minify CSS bundle size.
    // But watch out for layout changes.
    //
    // new PurifyCSSPlugin({
    //   styleExtensions: ['.scss', '.css', '.sass'],
    //   paths: glob.sync(path.join(__dirname, 'layouts/**/*.html')),
    //   purifyOptions: {
    //     info: true,
    //     whitelist: [
    //       '*title*',
    //       '*subtitle*',
    //       '*is-active*',
    //       '*column*',
    //       '*leaflet*'
    //     ]
    //   }
    // }),

    // Shims for global libs (ex. jquery)
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

    // new webpack.optimize.UglifyJsPlugin({
    //  mangle: false
    // })

    // If using moment.js, uncomment this to keep the bundle size small.
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}