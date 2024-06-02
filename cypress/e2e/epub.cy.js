import ePub from "../../src/epub"

const assets = (path) => {
    return "../../assets/" + path
}

describe("ePub", () => {
	it("should open a epub", async () => {
		const book = ePub(assets("alice/OPS/package.opf"))
		return book.opened.then(() => {
			expect(book.isOpen).to.equal(true)
			expect(book.url.toString()).to.equal("http://localhost:9876/assets/alice/OPS/package.opf")
		})
	})
	it("should open a archived epub", async () => {
		const book = ePub(assets("alice.epub"))
		return book.opened.then(() => {
			expect(book.isOpen).to.equal(true)
			expect(book.archive).to.exist
		})
	})
})