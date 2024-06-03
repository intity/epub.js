import assert from "assert"
import ePub from "../src/epub"

describe("Themes", () => {
    let book, rendition
    before(async () => {
        book = ePub("./fixtures/alice/")
        rendition = book.renderTo("viewer", {
            width: "100%",
            height: "100%"
        })
        rendition.display()
    })
    describe("#register()", () => {
        it("register a theme by url", async () => {
            await book.opened
            let theme
            rendition.themes.register("light", "../examples/themes.css")
            theme = rendition.themes.get("light")
            assert.equal(theme.url, "http://localhost:9876/examples/themes.css")
            rendition.themes.register("dark", "../examples/themes.css")
            theme = rendition.themes.get("dark")
            assert.equal(theme.url, "http://localhost:9876/examples/themes.css")
            rendition.themes.destroy()
            assert.equal(rendition.themes.size, 0)
        })
        it("register a theme by rules", async () => {
            await book.opened
            let theme
            rendition.themes.register("light", { background: "#fff", color: "#000" })
            theme = rendition.themes.get("light")
            assert.equal(theme.rules.background, "#fff")
            assert.equal(theme.rules.color, "#000")
            rendition.themes.register("dark", { background: "#000", color: "#fff" })
            theme = rendition.themes.get("dark")
            assert.equal(theme.rules.background, "#000")
            assert.equal(theme.rules.color, "#fff")
            rendition.themes.destroy()
            assert.equal(rendition.themes.size, 0)
        })
        it("register a themes from object", async () => {
            await book.opened
            let theme
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
            rendition.themes.destroy()
            assert.equal(rendition.themes.size, 0)
        })
    })
    describe("#select()", () => {
        it ("switching theme using select method", async () => {
            await book.opened
            let theme
            rendition.themes.register({
                light: "../examples/themes.css",
                dark: "../examples/themes.css"
            })
            theme = rendition.themes.get("light")
            assert.equal(theme.url, "http://localhost:9876/examples/themes.css")
            theme = rendition.themes.get("dark")
            assert.equal(theme.url, "http://localhost:9876/examples/themes.css")
            rendition.themes.select("light")
            assert.equal(rendition.themes.current, "light")
            rendition.themes.select("dark")
            assert.equal(rendition.themes.current, "dark")
            rendition.themes.destroy()
            assert.equal(rendition.themes.size, 0)
        })
    })
})