import Path from "../../src/utils/path"

describe("Path", () => {
    describe("#constructor()", () => {
        it("should init object properties from path", () => {
            const path = new Path("/fred/chasen/derf.html")
            expect(path.path).to.equal("/fred/chasen/derf.html")
            expect(path.directory).to.equal("/fred/chasen/")
            expect(path.extension).to.equal("html")
            expect(path.filename).to.equal("derf.html")
        })
        it("should init object properties from url", () => {
            const path = new Path("http://example.com/fred/chasen/derf.html")
            expect(path.path).to.equal("/fred/chasen/derf.html")
            expect(path.directory).to.equal("/fred/chasen/")
            expect(path.extension).to.equal("html")
            expect(path.filename).to.equal("derf.html")
        })
    })
    describe("#dirname()", () => {
        it("should get directory from path", () => {
            const path = Path.prototype.dirname("/fred/chasen/derf.html")
            expect(path).to.equal("/fred/chasen/")
        })
        it("should get directory from relative path", () => {
            const path = Path.prototype.dirname("fred/chasen/derf.html")
            expect(path).to.equal("fred/chasen/")
        })
    })
    describe("#parse()", () => {
        it("should parse a path", () => {
            const path = Path.prototype.parse("/fred/chasen/derf.html")
            expect(path.dir).to.equal("/fred/chasen")
            expect(path.ext).to.equal(".html")
            expect(path.base).to.equal("derf.html")
            expect(path.name).to.equal("derf")
        })
        it("should parse a relative path", () => {
            const path = Path.prototype.parse("fred/chasen/derf.html")
            expect(path.dir).to.equal("fred/chasen")
            expect(path.ext).to.equal(".html")
            expect(path.base).to.equal("derf.html")
            expect(path.name).to.equal("derf")
        })
    })
    describe("#isDirectory()", () => {
        it("should recognize a directory", () => {
            const isDir = Path.prototype.isDirectory
            expect(isDir("fred/chasen")).to.equal(false)
            expect(isDir("fred/chasen/")).to.equal(true)
            expect(isDir("/fred/chasen")).to.equal(false)
            expect(isDir("/fred/chasen/")).to.equal(true)
            expect(isDir("/fred/chasen/derf.html")).to.equal(false)
        })
    })
    describe("#resolve()", () => {
        it("should resolve a path", () => {
            const a = Path.prototype.dirname("/fred/chasen/index.html")
            const b = "derf.html"
            const resolved = Path.prototype.resolve(a, b)
            expect(resolved).to.equal("/fred/chasen/derf.html")
        })
        it("should resolve a relative path", () => {
            const a = Path.prototype.dirname("fred/chasen/index.html")
            const b = "derf.html"
            const resolved = Path.prototype.resolve(a, b)
            expect(resolved).to.equal("/fred/chasen/derf.html")
        })
        it("should resolve a level up", () => {
            const a = Path.prototype.dirname("/fred/chasen/index.html")
            const b = "../derf.html"
            const resolved = Path.prototype.resolve(a, b)
            expect(resolved).to.equal("/fred/derf.html")
        })
    })
    describe("#relative()", () => {
        it("should find a relative path at the same level", () => {
            const a = Path.prototype.dirname("/fred/chasen/index.html")
            const b = "/fred/chasen/derf.html"
            const relative = Path.prototype.relative(a, b)
            expect(relative).to.equal("derf.html")
        })
        it("should find a relative path down a level", () => {
            const a = Path.prototype.dirname("/fred/chasen/index.html")
            const b = "/fred/chasen/ops/derf.html"
            const relative = Path.prototype.relative(a, b)
            expect(relative).to.equal("ops/derf.html")
        })
        it("should resolve a level up", () => {
            const a = Path.prototype.dirname("/fred/chasen/index.html")
            const b = "/fred/derf.html"
            const relative = Path.prototype.relative(a, b)
            expect(relative).to.equal("../derf.html")
        })
    })
})