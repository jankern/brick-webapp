const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {

  let envType = !argv.mode ? 'development' : argv.mode ;
  console.log(envType);
  let isProd = envType == 'production' ? true : false; 
  console.log(isProd);

  // production: minimize html
  let doMinimizeHtml = isProd ? true : false;

  // production: minify css/js
  let optimization = !isProd ? {} : {
    splitChunks: {
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                chunks: 'all', // 'initial'
                enforce: true
            }
        }
    },
    minimizer: [
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
      new TerserPlugin({
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        // parallel: true,
        // Enable file caching
        // cache: true,
        // sourceMap: true
      }),
    ]
  };

  // basic plugins
  let plugins = [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
     new webpack.ProvidePlugin({
    //   jQuery: "jquery",
    //   $: "jquery",
    //   jquery: "jquery",
    //   "window.$": "jquery",
    //   "window.jQuery": "jquery"
    //  'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
  
    new MiniCssExtractPlugin({
      filename: "css/[name].bundle.css",
      chunkFilename: "css/[name][id].bundle.css"
    })
  ]

  // production: plugins
  if(isProd){
    plugins.push(
      new CopyWebpackPlugin({
        patterns:[
          {from: path.resolve(__dirname, './src/static')}
        ]
      })
    );
  }

  // development: webpack dev server root
  let devServer = isProd ? {} : {
    contentBase: '../../server/cole-blaq/html/resources/dist'
  };

  // config
  return {
    entry: {
        main: ["whatwg-fetch", "./src/js/index.js"],
        // -> target addon location as a shortcut fo development if addon gets not reinstalled
        // "../../../assets/addons/{name}/js/addon.{name}": "./src/js/addon.drpl_blog_post",
        // "../../../assets/addons/rdpl_blog_post/js/addon.rdpl_blog_post": "./src/js/addon.rdpl_blog_post",

        // -> initial addon location. From there the files is being processed while installation routine
        // '../../../redaxo/src/addons/{name}/assets/js/addon.{name}': './src/js/addon.{name}'
        // "../../../redaxo/src/addons/rdpl_blog_post/assets/js/addon.rdpl_blog_post": "./src/js/addon.rdpl_blog_post",
    },
    output: {
      filename: "js/[name].bundle.js",
      // path: path.resolve(__dirname, '../../redaxo-mit-docker-master/html/assets/dist')
      // path to use for separate backend package location
      path: path.resolve(
        __dirname,
        "../../server/cole-blaq/html/resources/dist"
      ),
      publicPath: '/',
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
                    options: { minimize: doMinimizeHtml }
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

    plugins,
    optimization: optimization,
    devServer,
    devtool: 'source-map',
    mode: envType
  };
};