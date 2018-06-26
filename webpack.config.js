const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const PATHS = {
  source: path.join(__dirname, 'source'),
  build: path.join(__dirname, 'static')
}

const ExtractApplicationCSS = new ExtractTextPlugin(path.join('css', 'application.css'), {
  allChunks: true
})

const ExtractEpubCSS = new ExtractTextPlugin(path.join('css', 'epub.css'))

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
            presets: ['es2015', 'stage-0']
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractApplicationCSS.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, path.resolve(__dirname, 'source/css/epub.scss')],
        use: ExtractApplicationCSS.extract({
          use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'source/css/epub.scss'),
        exclude: /node_modules/,
        use: ExtractEpubCSS.extract({
          use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      // file-loader(for images)
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
            outputPath: '../'
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
            name: 'fonts/[name].[ext]',
            outputPath: '../'
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

    // new webpack.optimize.UglifyJsPlugin({
    //  mangle: false
    // })

    // If using moment.js, uncomment this to keep the bundle size small.
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}