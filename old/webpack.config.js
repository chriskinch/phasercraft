const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
 
module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module: {
        rules: [
            { test: [ /\.vert$/, /\.frag$/ ], use: 'raw-loader' },
            { test: /\.(png|jpg|gif)$/, use: [{loader: 'file-loader'}] }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Phasercraft',
            //template: 'index.template.html',
            //manifest: '<link rel="manifest" href="manifest.json">',
            //inject: 'body'
        }),
        new CopyPlugin([
            { from: 'src/UI', to: 'UI' }
        ]),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        }),
        // new ManifestPlugin({
        //     seed: { name: 'Phasercraft Autogen Manifest' }
        // }),
        // new WorkboxPlugin.GenerateSW({
        //     // these options encourage the ServiceWorkers to get in there fast 
        //     // and not allow any straggling "old" SWs to hang around
        //     clientsClaim: true,
        //     skipWaiting: true
        // })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    }
};