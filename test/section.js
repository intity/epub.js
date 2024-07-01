import assert from "assert"
import Book from "../src/book"

describe("Section", () => {
    let book, section1, section2
    before(async () => {
        book = new Book("/assets/alice/", {
            width: 400,
            height: 400
        })
        await book.opened
    })
    describe("#load()", () => {
        it("should load section", async () => {
            section1 = book.section("chapter_001.xhtml")
            assert.equal(section1.idref, "chapter_001")
            assert.equal(section1.linear, true)
            assert.equal(section1.index, 3)
            assert.equal(section1.href, "chapter_001.xhtml")
            assert.equal(section1.url, "/assets/alice/OPS/chapter_001.xhtml")
            assert.equal(section1.cfiBase, "/6/8")
            await section1.load(book.request)
            assert.equal(section1.document instanceof Document, true)
            assert.equal(section1.contents instanceof Element, true)
        })
    })
    describe("#render()", () => {
        it("should render section", async () => {
            await section1.render(book.request)
            assert.equal(typeof section1.output === "string", true)
        })
    })
    describe("#find()", () => {
        before(async () => {
            section2 = book.section("chapter_010.xhtml")
            await section2.load(book.request)
        })
        it("should finds a single result in a section", () => {
            const pattern = "they were filled with cupboards and book-shelves"
            const results = section1.find(pattern)
            assert.equal(results.length, 1)
            assert.equal(results[0].cfi, "epubcfi(/6/8!/4/2/16,/1:275,/1:323)")
            assert.equal(results[0].excerpt, "... see anything; then she looked at the sides of the well and\n\t\tnoticed that they were filled with cupboards and book-shelves; here and there she saw\n\t\t...")
        })
        it("should finds multiple results in a section", () => {
            const pattern = "white rabbit"
            const results = section1.find(pattern)
            assert.equal(results.length, 2)
            assert.equal(results[0].cfi, "epubcfi(/6/8!/4/2/8,/1:240,/1:252)")
            assert.equal(results[0].excerpt, "...e worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her....")
            assert.equal(results[1].cfi, "epubcfi(/6/8!/4/2/20,/1:148,/1:160)")
            assert.equal(results[1].excerpt, "...ut it was\n\t\tall dark overhead; before her was another long passage and the White Rabbit was still\n\t\tin sight, hurrying down it. There was not a moment...")
        })
    })
    describe("#search()", () => {
        before(async () => {
            section2 = book.section("chapter_010.xhtml")
            await section2.load(book.request)
        })
        it("should finds a single result in a section", () => {
            const pattern = "they were filled with cupboards and book-shelves"
            const results = section1.search(pattern)
            assert.equal(results.length, 1)
            assert.equal(results[0].cfi, "epubcfi(/6/8!/4/2/16,/1:275,/1:323)")
            assert.equal(results[0].excerpt, "... see anything; then she looked at the sides of the well and\n\t\tnoticed that they were filled with cupboards and book-shelves; here and there she saw\n\t\t...")
        })
        it("should finds multiple results in a section", () => {
            const pattern = "white rabbit"
            const results = section1.search(pattern)
            assert.equal(results.length, 2)
            assert.equal(results[0].cfi, "epubcfi(/6/8!/4/2/8,/1:240,/1:252)")
            assert.equal(results[0].excerpt, "...e worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her....")
            assert.equal(results[1].cfi, "epubcfi(/6/8!/4/2/20,/1:148,/1:160)")
            assert.equal(results[1].excerpt, "...ut it was\n\t\tall dark overhead; before her was another long passage and the White Rabbit was still\n\t\tin sight, hurrying down it. There was not a moment...")
        })
        it("should finds result that spanning multiple document nodes, tag at ending", () => {
            const pattern = "I beg"
            const results = section2.search(pattern)
            assert.equal(results.length, 1)
            assert.equal(results[0].cfi, "epubcfi(/6/26!/4/2/6,/1:5,/2/1:3)")
            assert.equal(results[0].excerpt, "\"Oh, I beg")
        })
        it("should finds result that spanning multiple document nodes, tag at middle", () => {
            const pattern = "I beg your pardon"
            const results = section2.search(pattern)
            assert.equal(results.length, 1)
            assert.equal(results[0].cfi, "epubcfi(/6/26!/4/2/6,/1:5,/3:12)")
            assert.equal(results[0].excerpt, "\"Oh, I beg your pardon!\" she exclaimed in a tone of great dismay.")
        })
    })
})