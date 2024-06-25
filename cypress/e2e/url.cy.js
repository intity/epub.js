import Url from "../../src/utils/url"

describe("Url", () => {
	describe("#constructor()", () => {
		it("should init object properties from url", () => {
			const url = new Url("http://example.com/fred/chasen/derf.html")
			expect(url.href).to.equal("http://example.com/fred/chasen/derf.html")
			expect(url.directory).to.equal("/fred/chasen/")
			expect(url.extension).to.equal("html")
			expect(url.filename).to.equal("derf.html")
			expect(url.protocol).to.equal("http:")
			expect(url.origin).to.equal("http://example.com")
			expect(url.search).to.equal("")
		})
	})
	describe("#resolve()", () => {
		it("should join subfolders", () => {
			const a = "http://example.com/fred/chasen/"
			const b = "ops/derf.html"
			const resolved = new Url(a).resolve(b)
			expect(resolved).to.equal("http://example.com/fred/chasen/ops/derf.html")
		})
		it("should resolve up a level", () => {
			const a = "http://example.com/fred/chasen/index.html"
			const b = "../derf.html"
			const resolved = new Url(a).resolve(b)
			expect(resolved).to.equal("http://example.com/fred/derf.html")
		})
		it("should resolve absolute", () => {
			const a = "http://example.com/fred/chasen/index.html"
			const b = "/derf.html"
			const resolved = new Url(a).resolve(b)
			expect(resolved).to.equal("http://example.com/derf.html")
		})
		it("should resolve with search strings", () => {
			const a = "http://example.com/fred/chasen/index.html?debug=true"
			const b = "/derf.html"
			const resolved = new Url(a).resolve(b)
			expect(resolved).to.equal("http://example.com/derf.html")
		})
		it.skip("should handle directory with a dot", () => {
			const a = "http://example.com/fred/chasen/index.epub/"
			const url = new Url(a)
			expect(url.directory).to.equal("/fred/chasen/index.epub/")
			expect(url.extension).to.equal("")
		}) // Doesn't work with path.parse
		it("should handle file urls", () => {
			const directory = "/var/mobile/Containers/Data/Application/F47E4434-9B98-4654-93F1-702336B08EE6/Documents/books/moby-dick/"
			const href = "file://" + directory + "derf.html"
			const url = new Url(href)
			expect(url.href).to.equal(href)
			expect(url.directory).to.equal(directory)
			expect(url.extension).to.equal("html")
			expect(url.filename).to.equal("derf.html")
			expect(url.protocol).to.equal("file:")
			expect(url.origin).to.equal("file://") // origin should be blank
			expect(url.search).to.equal("")
		})
		it("should resolve with file urls", () => {
			const a = "file:///var/mobile/Containers/Data/Application/books/"
			const b = "derf.html"
			const resolved = new Url(a).resolve(b)
			expect(resolved).to.equal("file:///var/mobile/Containers/Data/Application/books/derf.html")
		})
	})
})