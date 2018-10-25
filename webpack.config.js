const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path');

module.exports = {
    entry: {
        background: './src/js/background.js',
        content: './src/js/content.js',
        panel: './src/js/panel.js',
        devtools: './src/js/devtools.js'
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
            { from: './src/manifest.json', to: './', force: true },
            { from: './src/html/*', to: './', force: true, flatten: true },
            { from: './src/styles/panel.css', to: './', force: true },
            { from: './src/styles/theme.css', to: './', force: true },
            { from: './src/images/*', to: './', force: true, flatten: true }
        ], {})
    ],
    watch: true
};