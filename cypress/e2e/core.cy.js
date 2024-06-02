import Url from "../../src/utils/url"
import Path from "../../src/utils/path"

describe("Core", () => {
    describe("Url", () => {
        it("Url()", () => {
			const url = new Url("http://example.com/fred/chasen/derf.html")
			expect(url.href).to.equal("http://example.com/fred/chasen/derf.html")
			expect(url.directory).to.equal("/fred/chasen/")
			expect(url.extension).to.equal("html")
			expect(url.filename).to.equal("derf.html")
            expect(url.protocol).to.equal("http:")
			expect(url.origin).to.equal("http://example.com")
			expect(url.search).to.equal("")
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
    describe("Path", () => {
        it("Path()", () => {
			const path = new Path("/fred/chasen/derf.html")
			expect(path.path).to.equal("/fred/chasen/derf.html")
			expect(path.directory).to.equal("/fred/chasen/")
			expect(path.extension).to.equal("html")
			expect(path.filename).to.equal("derf.html")
		})
		it("Strip out url", () => {
			const path = new Path("http://example.com/fred/chasen/derf.html")
			expect(path.path).to.equal("/fred/chasen/derf.html")
			expect(path.directory).to.equal("/fred/chasen/")
			expect(path.extension).to.equal("html")
			expect(path.filename).to.equal("derf.html")
		})
        describe("#parse()", () => {
			it("should parse a path", () => {
				const path = Path.prototype.parse("/fred/chasen/derf.html")
				expect(path.dir).to.equal("/fred/chasen")
				expect(path.base).to.equal("derf.html")
				expect(path.ext).to.equal(".html")
			})
			it("should parse a relative path", () => {
				const path = Path.prototype.parse("fred/chasen/derf.html")
				expect(path.dir).to.equal("fred/chasen")
				expect(path.base).to.equal("derf.html")
				expect(path.ext).to.equal(".html")
			})
		})
        describe("#isDirectory()", () => {
			it("should recognize a directory", () => {
				const result1 = Path.prototype.isDirectory("/fred/chasen/")
				const result2 = Path.prototype.isDirectory("/fred/chasen/derf.html")
				expect(result1).to.equal(true) // is a directory
				expect(result2).to.equal(false) // is not directory
			})
		})
        describe("#resolve()", () => {
			it("should resolve a path", () => {
				const a = "/fred/chasen/index.html"
				const b = "derf.html"
				const resolved = new Path(a).resolve(b)
				expect(resolved).to.equal("/fred/chasen/derf.html")
			})
			it("should resolve a relative path", () => {
				const a = "fred/chasen/index.html"
				const b = "derf.html"
				const resolved = new Path(a).resolve(b)
				expect(resolved).to.equal("/fred/chasen/derf.html")
			})
			it("should resolve a level up", () => {
				const a = "/fred/chasen/index.html"
				const b = "../derf.html"
				const resolved = new Path(a).resolve(b)
				expect(resolved).to.equal("/fred/derf.html")
			})
		})
        describe("#relative()", () => {
			it("should find a relative path at the same level", () => {
				const a = "/fred/chasen/index.html"
				const b = "/fred/chasen/derf.html"
				const relative = new Path(a).relative(b)
				expect(relative).to.equal("derf.html")
			})
			it("should find a relative path down a level", () => {
				const a = "/fred/chasen/index.html"
				const b = "/fred/chasen/ops/derf.html"
				const relative = new Path(a).relative(b)
				expect(relative).to.equal("ops/derf.html")
			})
			it("should resolve a level up", () => {
				const a = "/fred/chasen/index.html"
				const b = "/fred/derf.html"
				const relative = new Path(a).relative(b)
				expect(relative).to.equal("../derf.html")
			})
		})
    })
})