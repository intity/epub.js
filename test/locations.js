import assert from "assert"
import Book from "../src/book"
import Locations from "../src/locations"
import * as core from "../src/utils/core"
import chapter from "./fixtures/locations.xhtml"

describe("Locations", () => {
	describe("#parse", () => {
		it("parse locations from a document", () => {
			const doc = core.parse(chapter, "application/xhtml+xml")
			const contents = doc.documentElement
			const locations = new Locations()
			const result = locations.parse(contents, "/6/4[chap01ref]", 100)
			assert.equal(result.length, 15)
		})
		it("parse locations from xmldom", () => {
			const doc = core.parse(chapter, "application/xhtml+xml", true)
			const contents = doc.documentElement
			const locations = new Locations()
			const result = locations.parse(contents, "/6/4[chap01ref]", 100)
			assert.equal(result.length, 15)
		})
	})
	describe("#generate, #set", () => {
		const book = new Book("/fixtures/alice/OPS/package.opf")
		it("generate locations/use set method to change current location", async () => {
			await book.opened
			await book.locations.on("changed", (current, changed) => {
				switch(changed.index) {
					case 1:
						assert.equal(current.cfi, "epubcfi(/6/8!/4/2,/2[pgepubid00004]/1:0,/8/1:226)")
						assert.equal(current.percentage, 0.01)
						break;
					case 4:
						assert.equal(current.cfi, "epubcfi(/6/8!/4/2,/16/1:163,/18/1:79)")
						assert.equal(current.percentage, 0.04)
						break;
					case 8:
						assert.equal(current.cfi, "epubcfi(/6/8!/4/2,/26/1:464,/28/1:456)")
						assert.equal(current.percentage, 0.08)
						break;
					case 100:
						assert.equal(current.cfi, "epubcfi(/6/26!/4/2/60,/1:42,/1:296)")
						assert.equal(current.percentage, 1)
						break;
				}
			})
			await book.locations.generate(549).then((locations) => {
				assert.equal(locations.length, 101)
				locations.set({ index: 1 })
				locations.set({ index: 4 })
				locations.set({ index: 8 })
				locations.set({ index: 100 })
			})
		})
	})
})