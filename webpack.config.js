const webpack = require("webpack");
const path = require("path");

const config = {
	mode: "development",
	entry: {
		"epub": "./src/epub.js",
	},
	devtool: "source-map",
	output: {
		path: path.resolve("./dist"),
		filename: "[name].js",
		sourceMapFilename: "[name].js.map",
		library: "ePub",
		libraryTarget: "umd",
		libraryExport: "default",
		publicPath: "/dist/"
	},
	optimization: {
		minimize: false
	},
	externals: {
		"jszip/dist/jszip": "JSZip",
		"xmldom": "xmldom"
	},
	plugins: [],
	resolve: {
		alias: {
			path: "path-webpack"
		}
	},
	devServer: {
		host: "localhost",
		port: 8080,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
			"Access-Control-Allow-Headers": "Content-Type"
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [["@babel/preset-env", {
							targets: "last 2 Chrome versions, last 2 Safari versions, last 2 ChromeAndroid versions, last 2 iOS versions, last 2 Firefox versions, last 2 Edge versions",
							corejs: 3,
							useBuiltIns: "usage",
							bugfixes: true,
							modules: false
						}]]
					}
				}
			}
		]
	},
	performance: {
		hints: false
	}
}

module.exports = (env, args) => {

	let name = "[name]";
	if (env.legacy === "true") {
		name += ".legacy";
		config.module.rules[0].use.options.presets[0][1].targets = "defaults";
	}
	if (args.optimizationMinimize) {
		config.devtool = false;
		config.output.filename = name + ".min.js";
	} else {
		config.devtool = "source-map";
		config.output.filename = name + ".js";
		config.output.sourceMapFilename = name + ".js.map";
	}
	return config;
};
