import assert from "assert"
import Book from "../src/book"
import Locations from "../src/locations"
import * as core from "../src/utils/core"
import chapter from "../assets/locations.xhtml"

const book = new Book("/assets/alice/OPS/package.opf")

describe("Locations", () => {
	describe("#parse()", () => {
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
	describe("#generate()", () => {
		it("generating locations", async () => {
			await book.opened
			await book.locations.generate(549).then((locations) => {
				assert.equal(locations.length, 101)
			})
		})
	})
	describe("#set()", () => {
		it("checking set method to change current location", async () => {
			await book.opened
			await book.locations.on("changed", (current, changed) => {
				assert.equal(current.cfi, book.locations[changed.index])
			})
			const current = book.locations.current
			book.locations.set({ index: 1 }) // section:3
			assert.equal(current.percentage, 0.01)
			book.locations.set({ index: 4 })
			assert.equal(current.percentage, 0.04)
			book.locations.set({ index: 8 })
			assert.equal(current.percentage, 0.08)
			book.locations.set({ index: 12 })
			assert.equal(current.percentage, 0.12)
			book.locations.set({ index: 14 }) // section:4
			assert.equal(current.percentage, 0.14)
			book.locations.set({ index: 18 })
			assert.equal(current.percentage, 0.18)
			book.locations.set({ index: 21 })
			assert.equal(current.percentage, 0.21)
			book.locations.set({ index: 24 })
			assert.equal(current.percentage, 0.24)
			book.locations.set({ index: 25 }) // section:5
			assert.equal(current.percentage, 0.25)
			book.locations.set({ index: 28 })
			assert.equal(current.percentage, 0.28)
			book.locations.set({ index: 31 })
			assert.equal(current.percentage, 0.31)
			book.locations.set({ index: 34 })
			assert.equal(current.percentage, 0.34)
			book.locations.set({ index: 35 })
			assert.equal(current.percentage, 0.35)
			book.locations.set({ index: 36 }) // section:6
			assert.equal(current.percentage, 0.36)
			book.locations.set({ index: 41 })
			assert.equal(current.percentage, 0.41)
			book.locations.set({ index: 44 })
			assert.equal(current.percentage, 0.44)
			book.locations.set({ index: 48 })
			assert.equal(current.percentage, 0.48)
			book.locations.set({ index: 50 }) // section:7
			assert.equal(current.percentage, 0.50)
			book.locations.set({ index: 53 })
			assert.equal(current.percentage, 0.53)
			book.locations.set({ index: 56 })
			assert.equal(current.percentage, 0.56)
			book.locations.set({ index: 60 })
			assert.equal(current.percentage, 0.60)
			book.locations.set({ index: 61 }) // section:8
			assert.equal(current.percentage, 0.61)
			book.locations.set({ index: 65 })
			assert.equal(current.percentage, 0.65)
			book.locations.set({ index: 69 })
			assert.equal(current.percentage, 0.69)
			book.locations.set({ index: 71 }) // section:9
			assert.equal(current.percentage, 0.71)
			book.locations.set({ index: 74 })
			assert.equal(current.percentage, 0.74)
			book.locations.set({ index: 76 })
			assert.equal(current.percentage, 0.76)
			book.locations.set({ index: 77 }) // section:10
			assert.equal(current.percentage, 0.77)
			book.locations.set({ index: 81 })
			assert.equal(current.percentage, 0.81)
			book.locations.set({ index: 84 })
			assert.equal(current.percentage, 0.84)
			book.locations.set({ index: 88 })
			assert.equal(current.percentage, 0.88)
			book.locations.set({ index: 89 }) // section:11
			assert.equal(current.percentage, 0.89)
			book.locations.set({ index: 92 })
			assert.equal(current.percentage, 0.92)
			book.locations.set({ index: 95 }) // section:12
			assert.equal(current.percentage, 0.95)
			book.locations.set({ index: 98 })
			assert.equal(current.percentage, 0.98)
			book.locations.set({ index: 100 })
			assert.equal(current.percentage, 1)
		})
	})
})