import assert from "assert"
import Book from "../src/book"

describe("Book", () => {
	describe("Unarchived: open book from localhost server directory", () => {
		const book = new Book("/fixtures/alice/")
		it("should open a epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true, "book is opened")
			assert.equal(book.url.toString(), "http://localhost:9876/fixtures/alice/", "book url is passed to new Book instance")
			assert.equal(book.container.directory, "OPS/")
			assert.equal(book.container.fullPath, "OPS/package.opf")
			assert.equal(book.container.encoding, "UTF-8")
			assert.equal(book.container.mediaType, "application/oebps-package+xml")
		})
	})
	describe("Unarchived: open book from external server directory", () => {
		const book = new Book("https://s3.amazonaws.com/moby-dick/")
		it("should open a epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true, "book is opened")
			assert.equal(book.url.toString(), "https://s3.amazonaws.com/moby-dick/", "book url is passed to new Book instance")
			assert.equal(book.container.directory, "OPS/")
			assert.equal(book.container.fullPath, "OPS/package.opf")
			assert.equal(book.container.encoding, "UTF-8")
			assert.equal(book.container.mediaType, "application/oebps-package+xml")
		})
	})
	describe("Unarchived: open book from package.opf", () => {
		const book = new Book("/fixtures/alice/OPS/package.opf")
		it("should open a epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true, "book is opened")
			assert.equal(book.url.toString(), "http://localhost:9876/fixtures/alice/OPS/package.opf", "book url is passed to new Book instance")
		})
		it("should have a local coverUrl", async () => {
			const coverUrl = await book.coverUrl()
			assert.equal(coverUrl, "http://localhost:9876/fixtures/alice/OPS/images/cover_th.jpg", "cover url is available")
		})
	})
	describe("Archived: open book from epub file", () => {
		const book = new Book("/fixtures/alice.epub")
		it("should open a archived epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true, "book is opened")
			assert(book.archive, "book is unarchived")
		})
		it("should have a blob coverUrl", async () => {
			let coverUrl = await book.coverUrl()
			assert(/^blob:http:\/\/localhost:9876\/[^\/]+$/.test(coverUrl), "cover url is available and a blob: url")
		})
	})
	describe("Archived: open book from array buffer without options", () => {
		let book
		before(async () => {
			const response = await fetch("/fixtures/alice.epub")
			const buffer = await response.arrayBuffer()
			book = new Book(buffer)
		})
		it("should open a archived epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true, "book is opened")
			assert(book.archive, "book is unarchived")
		})
		it('should have a blob coverUrl', async () => {
			const coverUrl = await book.coverUrl()
			assert(/^blob:http:\/\/localhost:9876\/[^\/]+$/.test(coverUrl), "cover url is available and a blob: url")
		})
	})
	describe("Archived: open book from epub file without cover", () => {
		const book = new Book("/fixtures/alice_without_cover.epub")
		it("should open a archived epub", async () => {
			await book.opened
			assert.equal(book.isOpen, true, "book is opened")
			assert(book.archive, "book is unarchived")
		})
		it("should have a empty coverUrl", async () => {
			const coverUrl = await book.coverUrl()
			assert.equal(coverUrl, null, "cover url should be null")
		})
	})
})