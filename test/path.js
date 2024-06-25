import assert from "assert"
import Path from "../src/utils/path"

describe("Path", () => {
    describe("#constructor()", () => {
        it("should init object properties from path", () => {
            const path = new Path("/fred/chasen/derf.html")
            assert.equal(path.path, "/fred/chasen/derf.html")
            assert.equal(path.directory, "/fred/chasen/")
            assert.equal(path.extension, "html")
            assert.equal(path.filename, "derf.html")
        })
        it("should init object properties from url", () => {
            const path = new Path("http://example.com/fred/chasen/derf.html")
            assert.equal(path.path, "/fred/chasen/derf.html")
            assert.equal(path.directory, "/fred/chasen/")
            assert.equal(path.extension, "html")
            assert.equal(path.filename, "derf.html")
        })
    })
    describe("#dirname()", () => {
        it("should get directory from path", () => {
            const path = Path.prototype.dirname("/fred/chasen/derf.html")
            assert.equal(path, "/fred/chasen/")
        })
        it("should get directory from relative path", () => {
            const path = Path.prototype.dirname("fred/chasen/derf.html")
            assert.equal(path, "fred/chasen/")
        })
    })
    describe("#parse()", () => {
        it("should parse a path", () => {
            const path = Path.prototype.parse("/fred/chasen/derf.html")
            assert.equal(path.dir, "/fred/chasen")
            assert.equal(path.ext, ".html")
            assert.equal(path.base, "derf.html")
            assert.equal(path.name, "derf")
        })
        it("should parse a relative path", () => {
            const path = Path.prototype.parse("fred/chasen/derf.html")
            assert.equal(path.dir, "fred/chasen")
            assert.equal(path.ext, ".html")
            assert.equal(path.base, "derf.html")
            assert.equal(path.name, "derf")
        })
    })
    describe("#isDirectory()", () => {
        it("should recognize a directory", () => {
            const isDir = Path.prototype.isDirectory
            assert.equal(isDir("fred/chasen"), false)
            assert.equal(isDir("fred/chasen/"), true)
            assert.equal(isDir("/fred/chasen"), false)
            assert.equal(isDir("/fred/chasen/"), true)
            assert.equal(isDir("/fred/chasen/derf.html"), false)
        })
    })
    describe("#resolve()", () => {
        it("should resolve a path", () => {
            const a = Path.prototype.dirname("/fred/chasen/index.html")
            const b = "derf.html"
            const resolved = Path.prototype.resolve(a, b)
            assert.equal(resolved, "/fred/chasen/derf.html")
        })
        it("should resolve a relative path", () => {
            const a = Path.prototype.dirname("fred/chasen/index.html")
            const b = "derf.html"
            const resolved = Path.prototype.resolve(a, b)
            assert.equal(resolved, "/fred/chasen/derf.html")
        })
        it("should resolve a level up", () => {
            const a = Path.prototype.dirname("/fred/chasen/index.html")
            const b = "../derf.html"
            const resolved = Path.prototype.resolve(a, b)
            assert.equal(resolved, "/fred/derf.html")
        })
    })
    describe("#relative()", () => {
        it("should find a relative path at the same level", () => {
            const a = Path.prototype.dirname("/fred/chasen/index.html")
            const b = "/fred/chasen/derf.html"
            const relative = Path.prototype.relative(a, b)
            assert.equal(relative, "derf.html")
        })
        it("should find a relative path down a level", () => {
            const a = Path.prototype.dirname("/fred/chasen/index.html")
            const b = "/fred/chasen/ops/derf.html"
            const relative = Path.prototype.relative(a, b)
            assert.equal(relative, "ops/derf.html")
        })
        it("should resolve a level up", () => {
            const a = Path.prototype.dirname("/fred/chasen/index.html")
            const b = "/fred/derf.html"
            const relative = Path.prototype.relative(a, b)
            assert.equal(relative, "../derf.html")
        })
    })
})