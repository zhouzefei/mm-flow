const path = require("path");
const webpack = require("webpack");
const devMode = process.env.SYS_ENV !== "production";
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
		"react": 'react'
	},
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader?cacheDirectory=true"
				}
			},
			{
				test: /\.css$/,
				use: [
					devMode ? "style-loader" : MiniCssExtractPlugin.loader,
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
