const path = require("path");
const webpack = require("webpack");
const devMode = process.env.SYS_ENV !== "production";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode:"development",
	cache: true,
	entry: {
		app: "./index.js"
	},
	output: {
		filename: "index.js"
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			React: "react"
		}),
	],
	devServer: {
		host: "0.0.0.0",
		port: "1234",
		open: true,
		openPage: "./index.html",
		contentBase: "./public",
		hot: true
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)|dist/,
				use: {
					loader: "babel-loader?cacheDirectory=true",
					options: {
						presets: [["@babel/preset-env"], "@babel/preset-react"],
						plugins: [
							[
								"@babel/plugin-proposal-decorators",
								{ legacy: true }
							],
							[
								"@babel/plugin-proposal-class-properties",
								{ loose: true }
							],
							[
								"import",
								{
									libraryName: "antd",
									libraryDirectory: "lib",
									style: true
								}
							],
							"@babel/plugin-transform-runtime",
						]
					}
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.less$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" },
					{
						loader: "less-loader",
						options: {
							javascriptEnabled: true
						}
					}
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: "url-loader"
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: "url-loader"
			}
		]
	}
};
