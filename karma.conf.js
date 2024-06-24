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
                pattern: "assets/**/*",
                watched: false,
                included: false,
                served: true
            }
        ],
        frameworks: ["mocha", "webpack"],
        preprocessors: {
            "test/*.js": ["webpack", "sourcemap"],
        },
        reporters: ["spec"],
        specReporter: {
            showSpecTiming: true
        },
        port: 9876,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [
            "ChromiumHeadless",
            "ChromeHeadlessNoSandbox",
            "Firefox"
        ],
        singleRun: false,
        concurrency: Infinity,
        proxies: {
            "/assets/": "/base/assets/",
            "/examples/": "../examples/"
        },
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: "ChromiumHeadless",
                flags: ["--no-sandbox"]
            },
            FirefoxHeadless: {
                base: "Firefox",
                flags: ["-headless"]
            }
        },
        webpack: webpackConfig
    })
}