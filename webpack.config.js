const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
    entry: {
        app: './src/js/App.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Picoplanet'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets: ['es2015'] }},
        ],
        rules: [
            { test: /\.css$/, use: [ 'style-loader', 'css-loader'] },
            { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
            { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
            { test: /p2\.js/, use: ['expose-loader?p2'] }
        ]
    },
    resolve: {
        modules: [
            path.resolve('./src/js'),
            path.resolve('./node_modules')
        ],
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        }
    }
};