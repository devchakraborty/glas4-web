var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

var env = process.env.NODE_ENV;

module.exports = {
	entry: {
		javascript: './src/js/index.js',
		html: './src/index.html'
	},
	output: {
		path: './build',
		filename: 'bundle.js'
	},
	devtool: "source-map",
	module: {
		loaders: [
			{
				test: /\.html$/, loader: 'file?name=[name].[ext]'
			},
			{
				test: /\.(png|jpg)$/, loader: 'file?name=[hash].[ext]'
			},
			{
				test: /\.js$/, exclude: [/node_modules/], loader: 'source-map!react-hot!babel'
			},
			{
				test: /\.scss$/, loader: 'style!css!postcss!sass'
			}
		]
	},
	devServer: {
		contentBase: './build',
		historyApiFallback: true,
		port: 7000
	},
	postcss: function() {
		return [autoprefixer];
	},
	plugins: env == 'production' ? [new webpack.optimize.UglifyJsPlugin({minimize:true})] : []
};
