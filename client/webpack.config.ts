const path = require("path");
const autoprefixer = require("autoprefixer");
const htmlWebpackPlugin = require("html-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const webpack = require('webpack');
import { ConfigurationManager } from "@nivinjoseph/n-config";

const isDev = ConfigurationManager.getConfig<string>("env") === "dev";

const plugins = [
    new cleanWebpackPlugin(["src/client/dist"]),
    new htmlWebpackPlugin({
        template: "src/client/index-view.html",
        hash: true,
        // favicon: "src/client/images/favicon.png",
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
];

if (!isDev)
    plugins.push(new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
            keep_classnames: true
        }
    }));

module.exports = {
    entry: ["./src/client/client.js"],
    
    devServer: {
        contentBase: "src/client/dist",
        hot: true,
        open: true,
        inline: true,
        
    },
    
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "src/client/dist")
    },
    devtool: isDev ? "inline-source-map" : "source-map",
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "postcss-loader", // postcss
                options: {
                    plugins: () => [
                        require("postcss-flexbugs-fixes"),
                        autoprefixer({
                            browsers: [
                                ">1%",
                                "not ie < 9"
                            ],
                            flexbox: "no-2009"
                        })
                    ]
                }
            }, {
                loader: "sass-loader" // compiles Sass to CSS -> depends on node-sass
            }]
        },
        {
            test: /\.css$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: ["file-loader"]
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: ["file-loader"]
        },
        {
            test: /\.(html)$/,
            use: {
                loader: "html-loader",
                options: {
                    attrs: ["img:src", "use:xlink:href"]
                }
            }
        }]
    },
    plugins
};