'use strict';

const webpack = require('webpack');

module.exports = {
	entry: `${__dirname}/src/client/js/index.js`,
	output: {
		path: `${__dirname}/public/js`,
		filename: 'client.bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.jsx$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: "style-loader!css-loader"
			}
		]
	},
	mode: 'development',
	stats: {
		colors: true
	},
	devtool: 'source-map'
};