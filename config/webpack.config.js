var webpack = require('webpack');
var path = require('path');

module.exports = {
    'entry': {
        'jIMGCompress': path.resolve(__dirname, '../src/jIMGCompress.js')
    },
    'output': {
        'path': path.resolve(__dirname, '../build'),
        'filename': '[name].js',
        'sourceMapFilename': '[name].js.map'
    },
    'devtool': 'source-map',
    'module': {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    'plugins': [
        new webpack.optimize.UglifyJsPlugin({
            'compress': {
                'warnings': false
            }
        })
    ]
}
