const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path');

module.exports = {
    entry: {
        background: './src/ext/html/background.js',
        content: './src/ext/html/content.js',
        panel: './src/ext/html/panel.js',
        devtools: './src/ext/html/devtools.js',
        hookEventListener: './src/ext/html/hookEventListener.js',
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    optimization: {
        minimizer: [
            // new UglifyJsPlugin({
            //     sourceMap: true,
            //     test: /\.js($|\?)/i,
            //     parallel: true
            // })
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './src/ext/manifest.json', to: './', force: true },
            { from: './src/ext/html/devtools.html', to: './', force: true },
            { from: './src/ext/html/panel.html', to: './', force: true },
            { from: './src/ext/images/icon.png', to: './', force: true },
        ], {})
    ],
    watch: true
};