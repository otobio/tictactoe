var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
    entry: {
        packedscripts: ["./src/index.ts"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist/static/')
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // {test: /jquery\.js$/, loader: 'expose-loader?jQuery!expose?$'},
            {
                test: require.resolve("jquery"),
                loader: "expose-loader?$!expose-loader?jQuery"
            },
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /node_modules/,
                loader: 'ify-loader'
            },
            // CSS
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    loader: 'css-loader?sourceMap'
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    loader: ["css-loader?sourceMap", "sass-loader?sourceMap"]
                })
            },
            {
                test: /\.(jpe|jpg|png|gif|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file-loader?name=[name].[hash].[ext]'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'packedstyles.css',
            disable: false,
            allChunks: true
        }),
        // new CopyWebpackPlugin([{
        //     from: 'src/img'
        // }])
    ]
}
