'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const config = require('./webpack.base.config');

config.output.filename = 'jIMGCompress.min.js';
config.output.chunkFilename = 'jIMGCompress.min.js';

config.devtool = 'false';

config.plugins.push(new UglifyJSPlugin());
config.plugins.push(new webpack.DefinePlugin({
    PRODUCTION: JSON.stringify(true)
}));

module.exports = config;
