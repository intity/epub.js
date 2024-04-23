import assert from "assert"
import Locations from "../src/locations"
import * as core from "../src/utils/core"

describe("Locations", () => {
	describe("#parse", () => {
		const chapter = require('./fixtures/locations.xhtml').default
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
})