import Book from "../../src/book"
import Locations from "../../src/locations"
import * as core from "../../src/utils/core"

const assets = (path) => {
    return "../../assets/" + path
}

const load = async (path) => {
    let result
    await fetch(path).then(res => res.text()).then(text => {
        result = text
    })
    return result
}

describe("Locations", () => {
    let book, text
    before(async () => {
        book = new Book(assets("alice/OPS/package.opf"))
        text = await load(assets("locations.xhtml"))
    })
    describe("#parse()", () => {
		it("parse locations from a document", () => {
			const doc = core.parse(text, "application/xhtml+xml")
			const contents = doc.documentElement
			const locations = new Locations()
			const result = locations.parse(contents, "/6/4[chap01ref]", 100)
			expect(result.length).to.equal(15)
		})
		it("parse locations from xmldom", () => {
			const doc = core.parse(text, "application/xhtml+xml", true)
			const contents = doc.documentElement
			const locations = new Locations()
			const result = locations.parse(contents, "/6/4[chap01ref]", 100)
			expect(result.length).to.equal(15)
		})
	})
    describe("#generate()", () => {
		it("generating locations", async () => {
			await book.opened
			await book.locations.generate(549).then((locations) => {
				expect(locations.length).to.equal(101)
			})
		})
	})
    describe("#set()", () => {
		it("checking set method to change current location", async () => {
			await book.opened
			await book.locations.generated
			book.locations.on("changed", (current, changed) => {
				expect(current.cfi).to.equal(book.locations[changed.index])
			})
			const current = book.locations.current
			book.locations.set({ index: 1 }) // section:3
			expect(current.percentage).to.equal(0.01)
			book.locations.set({ index: 4 })
			expect(current.percentage).to.equal(0.04)
			book.locations.set({ index: 8 })
			expect(current.percentage).to.equal(0.08)
			book.locations.set({ index: 12 })
			expect(current.percentage).to.equal(0.12)
			book.locations.set({ index: 14 }) // section:4
			expect(current.percentage).to.equal(0.14)
			book.locations.set({ index: 18 })
			expect(current.percentage).to.equal(0.18)
			book.locations.set({ index: 21 })
			expect(current.percentage).to.equal(0.21)
			book.locations.set({ index: 24 })
			expect(current.percentage).to.equal(0.24)
			book.locations.set({ index: 25 }) // section:5
			expect(current.percentage).to.equal(0.25)
			book.locations.set({ index: 28 })
			expect(current.percentage).to.equal(0.28)
			book.locations.set({ index: 31 })
			expect(current.percentage).to.equal(0.31)
			book.locations.set({ index: 34 })
			expect(current.percentage).to.equal(0.34)
			book.locations.set({ index: 35 })
			expect(current.percentage).to.equal(0.35)
			book.locations.set({ index: 36 }) // section:6
			expect(current.percentage).to.equal(0.36)
			book.locations.set({ index: 41 })
			expect(current.percentage).to.equal(0.41)
			book.locations.set({ index: 44 })
			expect(current.percentage).to.equal(0.44)
			book.locations.set({ index: 48 })
			expect(current.percentage).to.equal(0.48)
			book.locations.set({ index: 50 }) // section:7
			expect(current.percentage).to.equal(0.50)
			book.locations.set({ index: 53 })
			expect(current.percentage).to.equal(0.53)
			book.locations.set({ index: 56 })
			expect(current.percentage).to.equal(0.56)
			book.locations.set({ index: 60 })
			expect(current.percentage).to.equal(0.60)
			book.locations.set({ index: 61 }) // section:8
			expect(current.percentage).to.equal(0.61)
			book.locations.set({ index: 65 })
			expect(current.percentage).to.equal(0.65)
			book.locations.set({ index: 69 })
			expect(current.percentage).to.equal(0.69)
			book.locations.set({ index: 71 }) // section:9
			expect(current.percentage).to.equal(0.71)
			book.locations.set({ index: 74 })
			expect(current.percentage).to.equal(0.74)
			book.locations.set({ index: 76 })
			expect(current.percentage).to.equal(0.76)
			book.locations.set({ index: 77 }) // section:10
			expect(current.percentage).to.equal(0.77)
			book.locations.set({ index: 81 })
			expect(current.percentage).to.equal(0.81)
			book.locations.set({ index: 84 })
			expect(current.percentage).to.equal(0.84)
			book.locations.set({ index: 88 })
			expect(current.percentage).to.equal(0.88)
			book.locations.set({ index: 89 }) // section:11
			expect(current.percentage).to.equal(0.89)
			book.locations.set({ index: 92 })
			expect(current.percentage).to.equal(0.92)
			book.locations.set({ index: 95 }) // section:12
			expect(current.percentage).to.equal(0.95)
			book.locations.set({ index: 98 })
			expect(current.percentage).to.equal(0.98)
			book.locations.set({ index: 100 })
			expect(current.percentage).to.equal(1)
		})
	})
	describe("#locationFromCfi()", () => {
        it("should get location from cfi", async () => {
			await book.opened
			await book.locations.generated
            book.locations.forEach((cfi, ind) => {
                const index = book.locations.locationFromCfi(cfi)
                expect(index).to.equal(ind)
            })
        })
    })
	describe("#percentageFromLocation()", () => {
		it("should get percentage from location", async () => {
			await book.opened
			await book.locations.generated
			const locations = book.locations
			expect(locations.percentageFromLocation(-1)).to.equal(0)
			expect(locations.percentageFromLocation(14)).to.equal(0.14)
			expect(locations.percentageFromLocation(25)).to.equal(0.25)
			expect(locations.percentageFromLocation(36)).to.equal(0.36)
			expect(locations.percentageFromLocation(50)).to.equal(0.50)
			expect(locations.percentageFromLocation(61)).to.equal(0.61)
			expect(locations.percentageFromLocation(71)).to.equal(0.71)
			expect(locations.percentageFromLocation(77)).to.equal(0.77)
			expect(locations.percentageFromLocation(89)).to.equal(0.89)
			expect(locations.percentageFromLocation(95)).to.equal(0.95)
		})
	})
	describe("#cfiFromPercentage()", () => {
		it("should get cfi from percentage", async () => {
			await book.opened
			await book.locations.generated
			const locations = book.locations
			expect(locations.cfiFromPercentage(0.01)).to.equal(locations[1])
			expect(locations.cfiFromPercentage(0.14)).to.equal(locations[14])
			expect(locations.cfiFromPercentage(0.25)).to.equal(locations[25])
			expect(locations.cfiFromPercentage(0.36)).to.equal(locations[36])
			expect(locations.cfiFromPercentage(0.50)).to.equal(locations[50])
			expect(locations.cfiFromPercentage(0.61)).to.equal(locations[61])
			expect(locations.cfiFromPercentage(0.71)).to.equal(locations[71])
			expect(locations.cfiFromPercentage(0.77)).to.equal(locations[77])
			expect(locations.cfiFromPercentage(0.89)).to.equal(locations[89])
			expect(locations.cfiFromPercentage(0.95)).to.equal(locations[95])
		})
	})
})