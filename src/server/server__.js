import express from "express";
import { stat } from "fs/promises";
import path from "path";

const server = express();

// const webpack = require("webpack");
// const config = require("../../webpack.config.js");
// const compiler = webpack(config);

// const webpackDevMiddleware = 
//     require("webpack-dev-middleware")(
//         compiler,
//         config.devServer
// )

// server.use(webpackDevMiddleware);

// --------------------------

// const webpack = require("webpack");
// const middleware = require("webpack-dev-middleware");
// const compiler = webpack({
//   // webpack options
// });

// server.use(
//   middleware(compiler, {
//     // webpack-dev-middleware options
//   })
// );

// ----------------------------

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const config = require('../../webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
server.use(
  webpackDevMiddleware(compiler, {
    //publicPath: config.output.publicPath,
  })
);

let relRootPath = "../../server/cole-blaq/html/resources/dist";
const staticMiddleware = express.static(relRootPath);   
server.use(require('morgan')('dev'));
server.use('/', staticMiddleware);

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
})