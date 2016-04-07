var path = require('path');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var webpackConfigBase = require('./webpack.config.js');

var compiler = new webpack(webpackConfigBase);
var server = new webpackDevServer(compiler, {
});
server.listen(8000, 'localhost', function () {
    console.log('now listening on port 8000 at localhost');
});
