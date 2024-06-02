import Book from "../../src/book"

const assets = (path) => {
    return "../../assets/" + path
}

const url = (pathname) => {
    return "http://localhost:9876/assets/" + pathname
}

describe("Book", () => {
    describe("Unarchived", () => {
        const book = new Book(assets("alice/OPS/package.opf"))
        it("should open a epub", async () => {
            await book.opened
            expect(book.isOpen).to.equal(true)
            expect(book.url.toString()).to.equal(url("alice/OPS/package.opf"))
        })
        it("should have a local coverUrl", async () => {
            const coverUrl = await book.coverUrl()
            expect(coverUrl).to.equal(url("alice/OPS/images/cover_th.jpg"))
        })
    })
    describe("Archived epub", () => {
        const book = new Book(assets("alice.epub"))
        it("should open a archived epub", async () => {
            await book.opened
            expect(book.isOpen).to.equal(true)
            expect(book.archive).to.exist
        })
        it("should have a blob coverUrl", async () => {
            const coverUrl = await book.coverUrl()
            expect(/^blob:http:\/\/localhost:9876\/[^\/]+$/.test(coverUrl)).to.equal(true)
        })
    })
    describe("Archived epub in array buffer without options", () => {
        let book
        before(async () => {
            const response = await fetch(assets("alice.epub"))
            const buffer = await response.arrayBuffer()
            book = new Book(buffer)
        })
        it("should open a archived epub", async () => {
            await book.opened
            expect(book.isOpen).to.equal(true)
            expect(book.archive).to.exist
        })
        it("should have a blob coverUrl", async () => {
            const coverUrl = await book.coverUrl()
            expect(/^blob:http:\/\/localhost:9876\/[^\/]+$/.test(coverUrl)).to.equal(true)
        })
    })
    describe("Archived epub without cover", () => {
		const book = new Book(assets("alice_without_cover.epub"))
		it("should open a archived epub", async () => {
			await book.opened
			expect(book.isOpen).to.equal(true)
			expect(book.archive).to.exist
		})
		it("should have a empty coverUrl", async () => {
			const coverUrl = await book.coverUrl()
            expect(coverUrl).to.null
		})
	})
})