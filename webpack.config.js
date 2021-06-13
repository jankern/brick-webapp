const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    // main: [
    //   './src/js/index.js',
    //   'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
    // ]
    main: ["whatwg-fetch", "./src/js/index.js"]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '../../server/cole-blaq/html/resources/dist',
    //hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: '../'
                }
            },
            'css-loader',
            'sass-loader',
            'postcss-loader'
        ]
      },
      {
          test: /\.html$/,
          use: [
              {
                  loader: "html-loader",
                  options: { minimize: false }
              }
          ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "font/[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      //title: 'Hot Module Replacement',
      template: "./src/index.html" 
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].bundle.css",
      chunkFilename: "css/[name][id].bundle.css"
    })
  ],
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(
      __dirname,
      "../../server/cole-blaq/html/resources/dist"
    ),
    publicPath: "/",
    clean: true,
  },
};