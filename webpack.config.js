const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')

const PATHS = {
  source: path.join(__dirname, 'source'),
  build: path.join(__dirname, 'static')
}

const ExtractApplicationCSS = new ExtractTextPlugin(path.join('css', 'application.css'), {
  allChunks: true
})

const ExtractEpubCSS = new ExtractTextPlugin(path.join('css', 'epub.css'))

module.exports = {
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
    loaders: [
      {
        // Vanilla CSS (vendor, etc)
        test: /\.css$/,
        loader: ExtractApplicationCSS.extract('css')
      },
      {
        // SCSS
        test: /\.scss$/,
        exclude: [/node_modules/, path.resolve(__dirname, 'source/css/epub.scss')],
        loader: ExtractApplicationCSS.extract('css!sass')
      },
      {
        // Epub SCSS
        test: /\.scss$/,
        include: path.resolve(__dirname, 'source/css/epub.scss'),
        exclude: /node_modules/,
        loader: ExtractEpubCSS.extract('css!sass')
      },
      {
        // JS (ES6 transforms)
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      {
        // Font Files (file loader)
        // Copy these to the fonts dir without changing their names.
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        loader: 'file',
        query: {
          name: 'fonts/[name].[ext]',
          publicPath: '../'
        }
      },
      {
        // Image Files
        test: /\.(png|jpg)$/,
        loader: 'file',
        query: {
          name: 'img/[name].[ext]',
          publicPath: '../'
        }
      }
    ]

  },
  plugins: [
    // Extract CSS into a separate file
    ExtractApplicationCSS,

    // Extract Epub CSS
    ExtractEpubCSS,

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

    new webpack.optimize.UglifyJsPlugin({ mangle: false })

    // If using moment.js, uncomment this to keep the bundle size small.
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}
