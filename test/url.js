import assert from "assert"
import Url from "../src/utils/url"

describe("Url", () => {
    it("Url()", () => {
        const url = new Url("http://example.com/fred/chasen/derf.html")
        assert.equal(url.href, "http://example.com/fred/chasen/derf.html")
        assert.equal(url.directory, "/fred/chasen/")
        assert.equal(url.extension, "html")
        assert.equal(url.filename, "derf.html")
        assert.equal(url.origin, "http://example.com")
        assert.equal(url.protocol, "http:")
        assert.equal(url.search, "")
    })
    describe("#resolve()", () => {
        it("should join subfolders", () => {
            const a = "http://example.com/fred/chasen/"
            const b = "ops/derf.html"
            const resolved = new Url(a).resolve(b)
            assert.equal(resolved, "http://example.com/fred/chasen/ops/derf.html")
        })
        it("should resolve up a level", () => {
            const a = "http://example.com/fred/chasen/index.html"
            const b = "../derf.html"
            const resolved = new Url(a).resolve(b)
            assert.equal(resolved, "http://example.com/fred/derf.html")
        })
        it("should resolve absolute", () => {
            const a = "http://example.com/fred/chasen/index.html"
            const b = "/derf.html"
            const resolved = new Url(a).resolve(b)
            assert.equal(resolved, "http://example.com/derf.html")
        })
        it("should resolve with search strings", () => {
            const a = "http://example.com/fred/chasen/index.html?debug=true"
            const b = "/derf.html"
            const resolved = new Url(a).resolve(b)
            assert.equal(resolved, "http://example.com/derf.html")
        })
        // it("should handle directory with a dot", () => {
        // 	const a = "http://example.com/fred/chasen/index.epub/"
        // 	const url = new Url(a)
        // 	assert.equal(url.directory, "/fred/chasen/index.epub/")
        // 	assert.equal(url.extension, "")
        // }) // Doesn't work with path.parse
        it("should handle file urls", () => {
            const directory = "/var/mobile/Containers/Data/Application/F47E4434-9B98-4654-93F1-702336B08EE6/Documents/books/moby-dick/"
            const href = "file://" + directory + "derf.html"
            const url = new Url(href)
            assert.equal(url.href, href)
            assert.equal(url.directory, directory)
            assert.equal(url.extension, "html")
            assert.equal(url.filename, "derf.html")
            assert.equal(url.origin, "file://") // origin should be blank
            assert.equal(url.protocol, "file:")
            assert.equal(url.search, "")
        })
        it("should resolve with file urls", () => {
            const a = "file:///var/mobile/Containers/Data/Application/books/"
            const b = "derf.html"
            const resolved = new Url(a).resolve(b)
            assert.equal(resolved, "file:///var/mobile/Containers/Data/Application/books/derf.html")
        })
    })
})