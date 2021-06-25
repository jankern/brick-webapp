const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const config = require('../../webpack.config.js');
const compiler = webpack(config);
const rewrite = require('express-urlrewrite');

app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true, 
    publicPath: config.output.publicPath,
    stats: { colors: true },
    // watchOptions: {
    //     aggregateTimeout: 300,
    //     poll: true
    // }
  })
);

let relRootPath = "../../server/cole-blaq/html/resources/dist";
//let relRootPath = "src/";
const staticMiddleware = express.static(relRootPath);   
app.use(require('morgan')('dev'));
//app.use('/', staticMiddleware);
app.use(rewrite(/^\/(\w+)/, '/'), staticMiddleware);

// app.use(webpackHotMiddleware(compiler,{
//   'log': console.log,
//   // 'path': '/__webpack_hmr',
//   // 'heartbeat': 10 * 1000
// }));

app.get("/getit", function(req, res) {
    res.json({'bla':'blub'});
   })

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port ... 3000!\n');
});