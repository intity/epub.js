import Book from "../../src/book"

const assets = (path) => {
    return "../../assets/" + path
}

const examples = (patch) => {
    return "../../examples/" + patch
}

const url = (pathname) => {
    return "http://localhost:9876/" + pathname
}

describe("Themes", () => {
    let book, rendition
    before(async () => {
        book = new Book(assets("alice/"))
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
            rendition.themes.register("light", examples("themes.css"))
            theme = rendition.themes.get("light")
            expect(theme.url).to.equal(url("examples/themes.css"))
            rendition.themes.register("dark", examples("themes.css"))
            theme = rendition.themes.get("dark")
            expect(theme.url).to.equal(url("examples/themes.css"))
            rendition.themes.destroy()
            expect(rendition.themes.size).to.equal(0)
        })
        it("register a theme by rules", async () => {
            await book.opened
            let theme
            rendition.themes.register("light", { background: "#fff", color: "#000" })
            theme = rendition.themes.get("light")
            expect(theme.rules.background).to.equal("#fff")
            expect(theme.rules.color).to.equal("#000")
            rendition.themes.register("dark", { background: "#000", color: "#fff" })
            theme = rendition.themes.get("dark")
            expect(theme.rules.background).to.equal("#000")
            expect(theme.rules.color).to.equal("#fff")
            rendition.themes.destroy()
            expect(rendition.themes.size).to.equal(0)
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
            expect(theme.rules.body.background).to.equal("#fff")
            expect(theme.rules.body.color).to.equal("#000")
            theme = rendition.themes.get("dark")
            expect(theme.rules.body.background).to.equal("#000")
            expect(theme.rules.body.color).to.equal("#fff")
            rendition.themes.destroy()
            expect(rendition.themes.size).to.equal(0)
        })
    })
    describe("#select()", () => {
        it ("switching theme using select method", async () => {
            await book.opened
            let theme
            rendition.themes.register({
                light: examples("themes.css"),
                dark: examples("themes.css")
            })
            theme = rendition.themes.get("light")
            expect(theme.url).to.equal(url("examples/themes.css"))
            theme = rendition.themes.get("dark")
            expect(theme.url).to.equal(url("examples/themes.css"))
            rendition.themes.select("light")
            expect(rendition.themes.current).to.equal("light")
            rendition.themes.select("dark")
            expect(rendition.themes.current).to.equal("dark")
            rendition.themes.destroy()
            expect(rendition.themes.size).to.equal(0)
        })
    })
})