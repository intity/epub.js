import Book from "../../src/book"

describe("Section", () => {
    const bookPath = "../../assets/alice/"
    const settings = { width: 400, height: 400 }
    it("finds a single result in a section", async () => {
        const book = new Book(bookPath, settings)
        return book.ready.then(() => {
            const section = book.section("chapter_001.xhtml")
            return section.load(book.request).then(() => {
                const queryString = "they were filled with cupboards and book-shelves"
                const results = [
                    section.find(queryString),
                    section.search(queryString)
                ]
                results.forEach(result => {
                    expect(result.length).to.equal(1)
                    expect(result[0].cfi).to.equal("epubcfi(/6/8!/4/2/16,/1:275,/1:323)")
                    expect(result[0].excerpt).to.equal("... see anything; then she looked at the sides of the well and\n\t\tnoticed that they were filled with cupboards and book-shelves; here and there she saw\n\t\t...")
                })
            })
        })
    })
    it("finds multiple results in a section", async () => {
        const book = new Book(bookPath, settings)
        return book.ready.then(() => {
            const section = book.section("chapter_001.xhtml")
            return section.load(book.request).then(() => {
                const queryString = "white rabbit"
                const results = [
                    section.find(queryString),
                    section.search(queryString)
                ]
                results.forEach(result => {
                    expect(result.length).to.equal(2)
                    expect(result[0].cfi).to.equal("epubcfi(/6/8!/4/2/8,/1:240,/1:252)")
                    expect(result[0].excerpt).to.equal("...e worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her....")
                    expect(result[1].cfi).to.equal("epubcfi(/6/8!/4/2/20,/1:148,/1:160)")
                    expect(result[1].excerpt).to.equal("...ut it was\n\t\tall dark overhead; before her was another long passage and the White Rabbit was still\n\t\tin sight, hurrying down it. There was not a moment...")
                })
            })
        })
    })
    it("finds result that spanning multiple document nodes, tag at ending", async () => {
        const book = new Book(bookPath, settings)
        return book.ready.then(() => {
            const section = book.section("chapter_010.xhtml")
            return section.load(book.request).then(() => {
                const queryString = "I beg"
                const findResult = section.find(queryString)
                expect(findResult.length).to.equal(0)
                const searchResults = section.search(queryString)
                expect(searchResults.length).to.equal(1)
                expect(searchResults[0].cfi).to.equal("epubcfi(/6/26!/4/2/6,/1:5,/2/1:3)")
                expect(searchResults[0].excerpt).to.equal("\"Oh, I beg")
            })
        })
    })
    it("finds result that spanning multiple document nodes, tag at middle", async () => {
        const book = new Book(bookPath, settings)
        return book.ready.then(() => {
            const section = book.section("chapter_010.xhtml")
            return section.load(book.request).then(() => {
                const queryString = "I beg your pardon"
                const findResult = section.find(queryString)
                expect(findResult.length).to.equal(0)
                const searchResults = section.search(queryString)
                expect(searchResults.length).to.equal(1)
                expect(searchResults[0].cfi).to.equal("epubcfi(/6/26!/4/2/6,/1:5,/3:12)")
                expect(searchResults[0].excerpt).to.equal("\"Oh, I beg your pardon!\" she exclaimed in a tone of great dismay.")
            })
        })
    })
})