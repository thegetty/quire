const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const PATHS = {
  source: path.resolve(__dirname, '../src/assets'),
  build: path.resolve(__dirname, '../site/assets')
};

module.exports = {
  mode: 'production',
  stats: {
    colors: true,
    preset: 'minimal'
  },
  performance: { hints: 'warning' },
  entry: [
    path.resolve(PATHS.source, 'js', 'application.js'),
    path.resolve(PATHS.source, 'styles', 'application.scss')
  ],
  output: {
    filename: path.join('js', 'application.js'),
    path: PATHS.build,
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
      },
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: { plugins: ['postcss-preset-env'] }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: 'img/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
      // new UglifyJSPlugin({
      //   sourceMap: true,
      //   uglifyOptions: {
      //     compress: {
      //       inline: false
      //     }
      //   }
      // })
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
      filename: path.join('styles', 'application.css')
    }),
    new WebpackManifestPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets')
    }
  }
};
