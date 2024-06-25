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
    let rendition, theme
    before(async () => {
        const book = new Book(assets("alice/"))
        rendition = book.renderTo(document.body, {
            width: "100%",
            height: "100%"
        })
        await book.opened
        await rendition.display()
    })
    describe("#register()", () => {
        it("should register a theme by url", () => {
            rendition.themes.register("light", examples("themes.css"))
            theme = rendition.themes.get("light")
            expect(theme.url).to.equal(url("examples/themes.css"))
            rendition.themes.register("dark", examples("themes.css"))
            theme = rendition.themes.get("dark")
            expect(theme.url).to.equal(url("examples/themes.css"))
            rendition.themes.clear()
            expect(rendition.themes.size).to.equal(0)
        })
        it("should register a theme by rules", () => {
            rendition.themes.register("light", { background: "#fff", color: "#000" })
            theme = rendition.themes.get("light")
            expect(theme.rules.background).to.equal("#fff")
            expect(theme.rules.color).to.equal("#000")
            rendition.themes.register("dark", { background: "#000", color: "#fff" })
            theme = rendition.themes.get("dark")
            expect(theme.rules.background).to.equal("#000")
            expect(theme.rules.color).to.equal("#fff")
            rendition.themes.clear()
            expect(rendition.themes.size).to.equal(0)
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
            expect(theme.rules.body.background).to.equal("#fff")
            expect(theme.rules.body.color).to.equal("#000")
            theme = rendition.themes.get("dark")
            expect(theme.rules.body.background).to.equal("#000")
            expect(theme.rules.body.color).to.equal("#fff")
            rendition.themes.clear()
            expect(rendition.themes.size).to.equal(0)
        })
        it("should register a themes from object with urls", () => {
            rendition.themes.register({
                light: examples("themes.css"),
                dark: examples("themes.css")
            })
            theme = rendition.themes.get("light")
            expect(theme.url).to.equal(url("examples/themes.css"))
            theme = rendition.themes.get("dark")
            expect(theme.url).to.equal(url("examples/themes.css"))
        })
    })
    describe("#select()", () => {
        it("switching theme using select method", () => {
            rendition.themes.on("selected", (key, theme) => {
                if (key === null) {
                    expect(theme.injected).to.equal(false)
                } else {
                    expect(theme.injected).to.equal(true)
                }
            })
            rendition.themes.select("light")
            expect(rendition.themes.current).to.equal("light")
            rendition.themes.select("dark")
            expect(rendition.themes.current).to.equal("dark")
            rendition.themes.select(null)
            expect(rendition.themes.current).to.equal(null)
        })
    })
    describe("#appendRule()", () => {
        it("should inject css rule into contents", () => {
            rendition.themes.appendRule("font-size", "100%")
            const rule = rendition.themes.rules["font-size"]
            expect(rule.value).to.equal("100%")
        })
    })
    describe("#removeRule()", () => {
        it("should reject css rule into contents", () => {
            rendition.themes.removeRule("font-size")
            const rule = rendition.themes.rules["font-size"]
            expect(rule).to.equal(undefined)
        })
    })
})