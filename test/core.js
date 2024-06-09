import assert from "assert"
import Url from "../src/utils/url"
import Path from "../src/utils/path"

describe("Core", () => {
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
	describe("Path", () => {
		it("Path()", () => {
			const path = new Path("/fred/chasen/derf.html")
			assert.equal(path.path, "/fred/chasen/derf.html")
			assert.equal(path.directory, "/fred/chasen/")
			assert.equal(path.extension, "html")
			assert.equal(path.filename, "derf.html")
		})
		it("Strip out url", () => {
			const path = new Path("http://example.com/fred/chasen/derf.html")
			assert.equal(path.path, "/fred/chasen/derf.html")
			assert.equal(path.directory, "/fred/chasen/")
			assert.equal(path.extension, "html")
			assert.equal(path.filename, "derf.html")
		})
		describe("#parse()", () => {
			it("should parse a path", () => {
				const path = Path.prototype.parse("/fred/chasen/derf.html")
				assert.equal(path.dir, "/fred/chasen")
				assert.equal(path.base, "derf.html")
				assert.equal(path.ext, ".html")
			})
			it("should parse a relative path", () => {
				const path = Path.prototype.parse("fred/chasen/derf.html")
				assert.equal(path.dir, "fred/chasen")
				assert.equal(path.base, "derf.html")
				assert.equal(path.ext, ".html")
			})
		})
		describe("#isDirectory()", () => {
			it("should recognize a directory", () => {
				const directory = Path.prototype.isDirectory("/fred/chasen/")
				const notDirectory = Path.prototype.isDirectory("/fred/chasen/derf.html")
				assert(directory, "/fred/chasen/ is a directory")
				assert(!notDirectory, "/fred/chasen/derf.html is not directory")
			})
		})
		describe("#resolve()", () => {
			it("should resolve a path", () => {
				const a = "/fred/chasen/index.html"
				const b = "derf.html"
				const path = new Path(a)
				const resolved = path.resolve(path.directory, b)
				assert.equal(resolved, "/fred/chasen/derf.html")
			})
			it("should resolve a relative path", () => {
				const a = "fred/chasen/index.html"
				const b = "derf.html"
				const path = new Path(a);
				const resolved = path.resolve(path.directory, b)
				assert.equal(resolved, "/fred/chasen/derf.html")
			})
			it("should resolve a level up", () => {
				const a = "/fred/chasen/index.html"
				const b = "../derf.html"
				const path = new Path(a)
				const resolved = path.resolve(path.directory, b)
				assert.equal(resolved, "/fred/derf.html")
			})
		})
		describe("#relative()", () => {
			it("should find a relative path at the same level", () => {
				const a = "/fred/chasen/index.html"
				const b = "/fred/chasen/derf.html"
				const path = new Path(a)
				const relative = path.relative(path.directory, b)
				assert.equal(relative, "derf.html")
			})
			it("should find a relative path down a level", () => {
				const a = "/fred/chasen/index.html"
				const b = "/fred/chasen/ops/derf.html"
				const path = new Path(a)
				const relative = path.relative(path.directory, b)
				assert.equal(relative, "ops/derf.html")
			})
			it("should resolve a level up", () => {
				const a = "/fred/chasen/index.html"
				const b = "/fred/derf.html"
				const path = new Path(a)
				const relative = path.relative(path.directory, b)
				assert.equal(relative, "../derf.html")
			})
		})
	})
})