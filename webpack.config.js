const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: "production",
	entry: {
		popup: "./src/popup.js",
		content: "./src/content.js",
		background: "./src/background.js",
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/popup.html",
		}),
		new MiniCssExtractPlugin({
			filename: "popup.css",
		}),
	],
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.html$/,
				loader: "html-loader",
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
		],
	},
};
