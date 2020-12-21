const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: "production",
	entry: {
		app: "./src/MMFlow.js"
	},
	output: {
		library: "MMFlow",
		libraryTarget: "umd",
		filename: "MMFlow.js"
	},
	
	externals: {
		"lodash": "lodash",
		"snapsvg": "snapsvg",
		"canvg": "canvg",
		"dagre":"dagre",
		"react": "react",
		"react-dom":"react-dom",
		"antd":"antd",
		"classnames":"classnames",
		"@tntd/mm-editor":"@tntd/mm-editor"
	},
	optimization: {
		minimize: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader?cacheDirectory=true",
					options: {
						presets: [["@babel/preset-env"], "@babel/preset-react"],
						plugins: [
							["@babel/plugin-proposal-decorators", { legacy: true }],
							["@babel/plugin-proposal-class-properties", { loose: true }],
							"@babel/plugin-transform-runtime"
						]
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader"
				]
			},
			{
				test: /\.less$/,
				use: [
					"style-loader",
					{
						loader: "css-loader"
					},
					{
						loader: "less-loader"
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
