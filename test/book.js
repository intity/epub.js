import assert from "assert"
import Book from "../src/book"

describe("Book(archived)", () => {
	describe("open book from epub file of local server", () => {
		const book = new Book("/assets/alice.epub")
		it("should open a archived epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true)
			assert.equal(book.archived, true)
		})
		it("should have a blob coverUrl", async () => {
			const coverUrl = await book.coverUrl()
			assert(/^blob:http:\/\/localhost:9876\/[^\/]+$/.test(coverUrl))
		})
		it("should book.container assertion", async () => {
			await book.opened
			assert.equal(book.container.directory, "OPS/")
			assert.equal(book.container.fullPath, "OPS/package.opf")
			assert.equal(book.container.encoding, "UTF-8")
			assert.equal(book.container.mediaType, "application/oebps-package+xml")
		})
	})
	describe("open book from epub file of external server", () => {
		const book = new Book("https://intity.github.io/epub-js/assets/alice.epub")
		it("should open a archived epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true)
			assert.equal(book.archived, true)
		})
		it("should have a blob coverUrl", async () => {
			const coverUrl = await book.coverUrl()
			assert(/^blob:http:\/\/localhost:9876\/[^\/]+$/.test(coverUrl))
		})
		it("should book.container assertion", async () => {
			await book.opened
			assert.equal(book.container.directory, "OPS/")
			assert.equal(book.container.fullPath, "OPS/package.opf")
			assert.equal(book.container.encoding, "UTF-8")
			assert.equal(book.container.mediaType, "application/oebps-package+xml")
		})
	})
	describe("open book from array buffer without options", () => {
		let book
		before(async () => {
			const response = await fetch("/assets/alice.epub")
			const buffer = await response.arrayBuffer()
			book = new Book(buffer)
		})
		it("should open a archived epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true)
			assert.equal(book.archived, true)
		})
		it("should have a blob coverUrl", async () => {
			const coverUrl = await book.coverUrl()
			assert(/^blob:http:\/\/localhost:9876\/[^\/]+$/.test(coverUrl))
		})
	})
	describe("open book from epub file without cover", () => {
		const book = new Book("/assets/alice_without_cover.epub")
		it("should open a archived epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true)
			assert.equal(book.archived, true)
		})
		it("should have a empty coverUrl", async () => {
			const coverUrl = await book.coverUrl()
			assert.equal(coverUrl, null)
		})
	})
})
describe("Book(unarchived)", () => {
	describe("open book from directory of local server", () => {
		const book = new Book("/assets/alice/")
		it("should open a epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true)
			assert.equal(book.archived, false)
			assert.equal(book.url.toString(), "http://localhost:9876/assets/alice/")
		})
		it("should book.container assertion", async () => {
			await book.opened
			assert.equal(book.container.directory, "OPS/")
			assert.equal(book.container.fullPath, "OPS/package.opf")
			assert.equal(book.container.encoding, "UTF-8")
			assert.equal(book.container.mediaType, "application/oebps-package+xml")
		})
	})
	describe("open book from directory of external server", () => {
		const book = new Book("https://intity.github.io/epub-js/assets/alice/")
		it("should open a epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true)
			assert.equal(book.archived, false)
			assert.equal(book.url.toString(), "https://intity.github.io/epub-js/assets/alice/")
		})
		it("should book.container assertion", async () => {
			await book.opened
			assert.equal(book.container.directory, "OPS/")
			assert.equal(book.container.fullPath, "OPS/package.opf")
			assert.equal(book.container.encoding, "UTF-8")
			assert.equal(book.container.mediaType, "application/oebps-package+xml")
		})
	})
	describe("open book from package.opf of local server", () => {
		const book = new Book("/assets/alice/OPS/package.opf")
		it("should open a epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true)
			assert.equal(book.archived, false)
			assert.equal(book.url.toString(), "http://localhost:9876/assets/alice/OPS/package.opf")
		})
		it("should have a local coverUrl", async () => {
			const coverUrl = await book.coverUrl()
			assert.equal(coverUrl, "http://localhost:9876/assets/alice/OPS/images/cover_th.jpg")
		})
	})
	describe("open book from package.opf of external server", () => {
		const book = new Book("https://intity.github.io/epub-js/assets/alice/OPS/package.opf")
		it("should open a epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true)
			assert.equal(book.archived, false)
			assert.equal(book.url.toString(), "https://intity.github.io/epub-js/assets/alice/OPS/package.opf")
		})
		it("should have a local coverUrl", async () => {
			const coverUrl = await book.coverUrl()
			assert.equal(coverUrl, "https://intity.github.io/epub-js/assets/alice/OPS/images/cover_th.jpg")
		})
	})
})