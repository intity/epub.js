import assert from "assert"
import Book from "../src/book"

describe("Themes", () => {
    let rendition, theme
    before(async () => {
        const book = new Book("/assets/alice/")
        rendition = book.renderTo(document.body, {
            width: "100%",
            height: "100%"
        })
        await book.opened
        await rendition.display()
    })
    describe("#register()", () => {
        it("should register a theme by url", () => {
            rendition.themes.register("light", "/examples/themes.css")
            theme = rendition.themes.get("light")
            assert.equal(theme.url, "http://localhost:9876/examples/themes.css")
            rendition.themes.register("dark", "/examples/themes.css")
            theme = rendition.themes.get("dark")
            assert.equal(theme.url, "http://localhost:9876/examples/themes.css")
            rendition.themes.clear()
            assert.equal(rendition.themes.size, 0)
        })
        it("should register a theme by rules", () => {
            rendition.themes.register("light", { background: "#fff", color: "#000" })
            theme = rendition.themes.get("light")
            assert.equal(theme.rules.background, "#fff")
            assert.equal(theme.rules.color, "#000")
            rendition.themes.register("dark", { background: "#000", color: "#fff" })
            theme = rendition.themes.get("dark")
            assert.equal(theme.rules.background, "#000")
            assert.equal(theme.rules.color, "#fff")
            rendition.themes.clear()
            assert.equal(rendition.themes.size, 0)
        })
        it("should register a themes from object with rules", () => {
            rendition.themes.register({
                light: {
                    body: {
                        background: "#fff",
                        color: "#000"
                    }
                },
                dark: {
                    body: {
                        background: "#000",
                        color: "#fff"
                    }
                }
            })
            theme = rendition.themes.get("light")
            assert.equal(theme.rules.body.background, "#fff")
            assert.equal(theme.rules.body.color, "#000")
            theme = rendition.themes.get("dark")
            assert.equal(theme.rules.body.background, "#000")
            assert.equal(theme.rules.body.color, "#fff")
            rendition.themes.clear()
            assert.equal(rendition.themes.size, 0)
        })
        it("should register a themes from object with urls", () => {
            rendition.themes.register({
                light: "/examples/themes.css",
                dark: "/examples/themes.css"
            })
            theme = rendition.themes.get("light")
            assert.equal(theme.url, "http://localhost:9876/examples/themes.css")
            theme = rendition.themes.get("dark")
            assert.equal(theme.url, "http://localhost:9876/examples/themes.css")
        })
    })
    describe("#select()", () => {
        it ("switching theme using select method", () => {
            rendition.themes.on("selected", (key, value) => {
                assert.equal(value.injected, true)
            })
            rendition.themes.select("light")
            assert.equal(rendition.themes.current, "light")
            rendition.themes.select("dark")
            assert.equal(rendition.themes.current, "dark")
        })
    })
    describe("#appendRule()", () => {
        it("should inject css rule into contents", () => {
            rendition.themes.appendRule("font-size", "100%")
            const rule = rendition.themes.rules["font-size"]
            assert.equal(rule.value, "100%")
        })
    })
    describe("#removeRule()", () => {
        it("should reject css rule into contents", () => {
            rendition.themes.removeRule("font-size")
            const rule = rendition.themes.rules["font-size"]
            assert.equal(rule, undefined)
        })
    })
})