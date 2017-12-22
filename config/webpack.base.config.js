'use strict';

const path = require('path');

const config = {
    entry: path.resolve(__dirname, '../src/jIMGCompress'),

    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'jIMGCompress.js',
        publicPath: '',
        library: 'jimgcompress', 
        libraryTarget: 'umd'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },

    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, '../src')
        ],
        extensions: ['.js', '.json']
    },

    plugins: [],

    performance: {
        hints: 'warning', // enum
        maxAssetSize: 200000, // int (in bytes),
        maxEntrypointSize: 400000, // int (in bytes)
        assetFilter: function(assetFilename) {
            // Function predicate that provides asset filenames
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },

    devtool: 'false',

    context: __dirname,

    stats: 'errors-only'
};

module.exports = config;
