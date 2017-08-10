const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const root = path.resolve(__dirname);
const src = path.resolve(root, 'src');
const legacy = path.resolve(root, 'modules');
const dist = path.resolve(root, 'dist');

module.exports = {
  context: root,
  entry: {
    app: './src/index.js',
    // Both the app and the vendor bundle include all third party dependencies.
    // This makes the commons plugin extract all these dependencies and put
    // them in the commons bundle, which leaves the vendor plugin empty. There
    // must be a cleaner way to do this.
    vendor: './src/vendor.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: dist
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: dist
  },
  resolve: {
    modules: [
      './node_modules',
      './bower_components',
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          src,
          legacy
        ],
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        include: [
          src,
          legacy
        ],
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false, // Disable URL parsing in css for now
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.html$/,
        include: [
          legacy
        ],
        use: 'html-loader',
      },
      {
        test: /\.(png|svg|cur)$/,
        include: [
          legacy
        ],
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/'
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([dist]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons'
    }),
    new CopyWebpackPlugin([
      { from: './node_modules/leaflet/dist/leaflet.js' },
      // Simply copy the leaflet styling for now
      { from: './node_modules/leaflet/dist/leaflet.css' },
      // proj4 is giving troubles when included by webpack, resulting in syntax
      // errors. For now it is dumbly being copied to the output directory.
      // This means also proj4leaflet is copied this way (otherwise it will
      // require proj4 itself resulting in syntax errors again) and leaflet as
      // well because it needs to be loaded before proj4.
      { from: './node_modules/proj4/dist/proj4.js' },
      { from: './node_modules/proj4leaflet/src/proj4leaflet.js' },
      // Dumb copy of all assets for now
      {
        from: './build/assets',
        to: 'assets'
      }
    ]),
    new HtmlWebpackPlugin({
      inject: false,
      template: './index.ejs',
      links: [
        {href: 'leaflet.css', rel: 'stylesheet'},
      ],
      scripts: [
        'leaflet.js',
        'proj4.js',
        'proj4leaflet.js'
      ]
    }),
    new ExtractTextPlugin('main.css')
  ]
};
