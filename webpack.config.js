const webpack = require("webpack")
const path = require("path")
const PROD = (process.env.NODE_ENV === "production")
const LEGACY = (process.env.LEGACY)
const MINIMIZE = (process.env.MINIMIZE === "true")
let filename = "[name]"
let sourceMapFilename = "[name]"
if (LEGACY) {
	filename += ".legacy"
}
if (MINIMIZE) {
	filename += ".min.js"
	sourceMapFilename += ".min.js.map"
} else {
	filename += ".js"
	sourceMapFilename += ".js.map"
}

module.exports = {
	mode: process.env.NODE_ENV,
	entry: {
		"epub": "./src/epub.js",
	},
	devtool: PROD ? "source-map" : "eval-source-map",
	output: {
		path: path.resolve("./dist"),
		filename: filename,
		sourceMapFilename: sourceMapFilename,
		library: "ePub",
		libraryTarget: "umd",
		libraryExport: "default",
		publicPath: "/dist/"
	},
	optimization: {
		minimize: MINIMIZE
	},
	externals: {
		"jszip/dist/jszip": "JSZip",
		"xmldom": "xmldom"
	},
	plugins: [
		new webpack.ProvidePlugin({
			process: "process/browser"
		})
	],
	resolve: {
		alias: {
			path: "path-webpack",
			process: "process/browser"
		}
	},
	devServer: {
		hot: false,
		liveReload: true,
		static: {
			directory: path.resolve(__dirname, "examples")
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
							targets: LEGACY ? "defaults" : "last 2 Chrome versions, last 2 Safari versions, last 2 ChromeAndroid versions, last 2 iOS versions, last 2 Firefox versions, last 2 Edge versions",
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