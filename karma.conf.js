const webpackConfig = require("./webpack.config.js")
webpackConfig.mode = "development"
webpackConfig.externals = {}
webpackConfig.module.rules.push({
    test: /\.xhtml$/i,
    type: "asset/source"
})

module.exports = (config) => {
    config.set({
        exclude: [],
        files: [
            {
                pattern: "src/*.js",
                watched: true,
                included: false,
                served: false
            },
            {
                pattern: "test/*.js",
                watched: false
            },
            {
                pattern: "test/fixtures/**/*",
                watched: false,
                included: false,
                served: true
            }
        ],
        frameworks: ["mocha", "webpack"],
        preprocessors: {
            "test/*.js": ["webpack", "sourcemap"],
        },
        reporters: ["mocha"],
        port: 9876,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [
            "ChromiumHeadless",
            "ChromeHeadlessNoSandbox"
        ],
        singleRun: false,
        concurrency: Infinity,
        proxies: {
            "/fixtures/": "/base/test/fixtures/"
        },
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: "ChromiumHeadless",
                flags: ["--no-sandbox"]
            }
        },
        webpack: webpackConfig
    })
}