var webpack = require('webpack');
var path = require('path');

const definePlugin = new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
});
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
    entry: isProduction ? ["./src/main.js"] :
        [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client',
            "./src/main.js"
        ]
    ,
    output: {
        path: "/",
        filename: "bundle.js"
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loaders: ['eslint'],
                include: [
                    path.resolve(__dirname, "src")
                ],
                exclude: [/node_modules/, /public/]
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.jsx$/,
                loader: 'babel',
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!autoprefixer-loader!less",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader!autoprefixer-loader",
                exclude: [/node_modules/, /public/]
            }
        ]
    },

    plugins: isProduction ? [
        new webpack.NoErrorsPlugin(),
        definePlugin,
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false}
        })
    ] : [
        new webpack.HotModuleReplacementPlugin()
    ],

    resolve: {
        extensions: ['', '.js', '.jsx', '.json', '.css', '.less']
    }
};
