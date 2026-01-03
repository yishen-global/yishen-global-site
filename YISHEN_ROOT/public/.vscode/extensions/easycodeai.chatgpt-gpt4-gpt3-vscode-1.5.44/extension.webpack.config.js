//@ts-check

'use strict';

const withDefaults = require('../shared.webpack.config');

module.exports = withDefaults({
	context: __dirname,
	entry: {
		extension: './src/extension.ts',
	},
	output: {
		filename: 'main.extension.js',
		library: {
			type: 'commonjs2'
		}
	},
	externals: {
		'playwright-core': 'commonjs2 playwright-core',
		'vscode': 'commonjs vscode',
	},
	resolve: {
		extensions: ['.ts', '.js', '.tsx', '.jsx']
	}
});
