const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: "production",
	entry: {
		popup: "./src/popup.ts",
		content: "./src/content.ts",
		background: "./src/background.ts",
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "popup.html",
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
