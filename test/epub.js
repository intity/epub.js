import assert from "assert"
import ePub from "../src/epub"

describe("ePub", () => {
	it("should open a epub", async () => {
		const book = ePub("/assets/alice/OPS/package.opf")
		return book.opened.then(() => {
			assert.equal(book.isOpen, true, "book is opened")
			assert.equal(book.url.toString(), "http://localhost:9876/assets/alice/OPS/package.opf", "book url is passed to new Book")
		})
	})
	it("should open a archived epub", async () => {
		const book = ePub("/assets/alice.epub")
		return book.opened.then(() => {
			assert.equal(book.isOpen, true, "book is opened")
			assert(book.archive, "book is unarchived")
		})
	})
})