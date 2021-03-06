const webpack = require('webpack');
const RequirePlugin = require('umd-compat-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const basePath = process.cwd();

module.exports = {
	entry: {
		'src/main': [
			path.join(basePath, 'src/main.styl'),
			path.join(basePath, 'src/main.ts')
		]
	},
	devtool: 'source-map',
	resolve: {
		root: [ basePath ],
		extensions: ['', '.ts', '.tsx', '.js'],
		alias: {
			rxjs: '@reactivex/rxjs/dist/amd'
		}
	},
	resolveLoader: {
		root: [ path.join(__dirname, 'node_modules') ]
	},
	module: {
		unknownContextRegExp: /$^/,
		unknownContextCritical: false,
		exprContextRegExp: /$^/,
		exprContextCritical: false,
		preLoaders: [
			{
				test: /dojo-.*\.js$/,
				loader: 'source-map-loader'
			}
		],
		loaders: [
			{ test: /src[\\\/].*\.ts?$/, loader: 'ts-loader' },
			{ test: /\.html$/, loader: "html" },
			{ test: /\.(jpe|jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'file?name=[path][name].[hash:6].[ext]' },
			{ test: /\.styl$/, loader: ExtractTextPlugin.extract(['css-loader?sourceMap', 'stylus-loader']) }
		]
	},
	plugins: [
		new ExtractTextPlugin('main.css'),
		new CopyWebpackPlugin([
			{ context: 'src', from: '**/*', ignore: '*.ts' },
		]),
		new RequirePlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }}),
		new HtmlWebpackPlugin ({
			inject: true,
			chunks: [ 'src/main' ],
			template: 'src/index.html'
		})
	],
	output: {
		path: path.resolve('./dist'),
		filename: '[name].js'
	}
};
