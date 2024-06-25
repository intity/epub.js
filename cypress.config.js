const { defineConfig } = require("cypress")

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on("task", {
                log(message) {
                    console.log(message)
                }
            })
        },
        excludeSpecPattern: [
            // "cypress/e2e/book.cy.js",
            // "cypress/e2e/epub.cy.js",
            // "cypress/e2e/epubcfi.cy.js",
            // "cypress/e2e/locations.cy.js",
            // "cypress/e2e/packaging.cy.js",
            // "cypress/e2e/path.cy.js",
            // "cypress/e2e/section.cy.js",
            // "cypress/e2e/themes.cy.js",
            // "cypress/e2e/url.cy.js"
        ]
    }
})