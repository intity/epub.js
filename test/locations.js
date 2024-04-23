import assert from "assert"
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
})