import assert from "assert"
import Book from "../src/book"

describe("Sections", () => {
    let book
    before(async () => {
        book = new Book("/assets/alice/")
        await book.opened
    })
    describe("#get()", () => {
        it("should get default section", () => {
            const section = book.sections.get()
            assert.equal(section.idref, "titlepage")
            assert.equal(section.linear, true)
            assert.equal(section.index, 2)
            assert.equal(section.href, "titlepage.xhtml")
            assert.equal(section.url, "/assets/alice/OPS/titlepage.xhtml")
            assert.equal(section.cfiBase, "/6/6")
        })
        it("should get section from index", () => {
            const section = book.sections.get(1)
            assert.equal(section.idref, "toc")
            assert.equal(section.linear, false)
            assert.equal(section.index, 1)
            assert.equal(section.href, "toc.xhtml")
            assert.equal(section.url, "/assets/alice/OPS/toc.xhtml")
            assert.equal(section.cfiBase, "/6/4")
        })
        it("should get section from id", () => {
            const section = book.sections.get("#chapter_010")
            assert.equal(section.idref, "chapter_010")
            assert.equal(section.linear, true)
            assert.equal(section.index, 12)
            assert.equal(section.href, "chapter_010.xhtml")
            assert.equal(section.url, "/assets/alice/OPS/chapter_010.xhtml")
            assert.equal(section.cfiBase, "/6/26")
        })
        it("should get section from href", () => {
            const section = book.sections.get("chapter_001.xhtml")
            assert.equal(section.idref, "chapter_001")
            assert.equal(section.linear, true)
            assert.equal(section.index, 3)
            assert.equal(section.href, "chapter_001.xhtml")
            assert.equal(section.url, "/assets/alice/OPS/chapter_001.xhtml")
            assert.equal(section.cfiBase, "/6/8")
        })
        it("should get section from epubcfi", () => {
            const section = book.sections.get("epubcfi(/6/8!/4/2/16/1:0)")
            assert.equal(section.idref, "chapter_001")
            assert.equal(section.linear, true)
            assert.equal(section.index, 3)
            assert.equal(section.href, "chapter_001.xhtml")
            assert.equal(section.url, "/assets/alice/OPS/chapter_001.xhtml")
            assert.equal(section.cfiBase, "/6/8")
        })
    })
    describe("#first()", () => {
        it("should get first section", () => {
            const section = book.sections.first()
            assert.equal(section.idref, "titlepage")
            assert.equal(section.linear, true)
            assert.equal(section.index, 2)
            assert.equal(section.href, "titlepage.xhtml")
            assert.equal(section.url, "/assets/alice/OPS/titlepage.xhtml")
            assert.equal(section.cfiBase, "/6/6")
        })
    })
    describe("#last()", () => {
        it("should get last section", () => {
            const section = book.sections.last()
            assert.equal(section.idref, "chapter_010")
            assert.equal(section.linear, true)
            assert.equal(section.index, 12)
            assert.equal(section.href, "chapter_010.xhtml")
            assert.equal(section.url, "/assets/alice/OPS/chapter_010.xhtml")
            assert.equal(section.cfiBase, "/6/26")
        })
    })
})