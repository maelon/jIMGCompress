'use strict';

const path = require('path');
const config = require('./webpack.base.config');

config.devtool = 'eval-source-map';

config.devServer = {
    contentBase: path.join(__dirname, '../'),
    compress: true,
    noInfo: true,
}

module.exports = config;
