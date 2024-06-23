import assert from "assert"
import Path from "../src/utils/path"

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