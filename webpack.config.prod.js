const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');

const package = require('./package.json');

const commonConfig = {
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            { test: /\.(png|jpe?g|gif)$/i, loader: 'file-loader' },
            { test: /\.(ts|js)x?$/, loader: 'babel-loader', include: /src/ },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.py$/, use: 'raw-loader' }
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'env_APP_VERSION': `"${package.version}"`
        })
    ],

    mode: "production"
}

const electronMainConfig = merge(commonConfig, {
    entry: {
        main: path.resolve(__dirname, 'src', 'main'),
    },
    target: 'electron-main',
})

const electronRendererConfig = merge(commonConfig, {
    entry: {
        renderer: path.resolve(__dirname, 'src', 'renderer')
    },
    target: 'electron-renderer',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Tabpy Tools',
            template: './src/renderer/templates/index.html',
            chunks: ['renderer'],
            inject: 'body'
        }),
    ],
})

module.exports = [electronMainConfig, electronRendererConfig]