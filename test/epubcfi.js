import assert from "assert"
import EpubCFI from "../src/epubcfi"
if (typeof DOMParser === "undefined") {
	global.DOMParser = require("@xmldom/xmldom").DOMParser
}

describe("EpubCFI", () => {
	it("parse a cfi on init", () => {
		const cfi = new EpubCFI("epubcfi(/6/2[cover]!/6)")
		assert.equal(cfi.spinePos, 0, "spinePos is parsed as the first item")
	})
	it("parse a cfi and ignore the base if present", () => {
		const cfi = new EpubCFI("epubcfi(/6/2[cover]!/6)", "/6/6[end]")
		assert.equal(cfi.spinePos, 0, "base is ignored and spinePos is parsed as the first item")
	})
	describe("#parse()", () => {
		const cfi = new EpubCFI()
		it("parse a cfi on init", () => {
			const parsed = cfi.parse("epubcfi(/6/2[cover]!/6)")
			assert.equal(parsed.spinePos, 0, "spinePos is parsed as the first item")
		})
		it("parse a cfi and ignore the base if present", () => {
			const parsed = cfi.parse("epubcfi(/6/2[cover]!/6)", "/6/6[end]")
			assert.equal(parsed.spinePos, 0, "base is ignored and spinePos is parsed as the first item")
		})
		it("parse a cfi with a character offset", () => {
			const parsed = cfi.parse("epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)")
			assert.equal(parsed.path.terminal.offset, 3, "Path has a terminal offset of 3")
		})
		it("parse a cfi with a range", () => {
			const parsed = cfi.parse("epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)")
			assert.equal(parsed.range, true, "Range is true")
			assert.equal(parsed.start.steps.length, 2, "Start steps are present")
			assert.equal(parsed.end.steps.length, 1, "End steps are present")
			assert.equal(parsed.start.terminal.offset, 1, "Start has a terminal offset of 1")
			assert.equal(parsed.end.terminal.offset, 4, "End has a terminal offset of 4")
		})
	})
	describe("#toString()", () => {
		it("parse a cfi and write it back", () => {
			assert.equal(new EpubCFI("epubcfi(/6/2[cover]!/6)").toString(), "epubcfi(/6/2[cover]!/6)", "output cfi string is same as input")
			assert.equal(new EpubCFI("epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)").toString(), "epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)", "output cfi string is same as input")
			assert.equal(new EpubCFI("epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)").toString(), "epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)", "output cfi string is same as input")
		})
	})
	describe("#checkType()", () => {
		it("determine the type of a cfi string", () => {
			const cfi = new EpubCFI()
			assert.equal(cfi.checkType("epubcfi(/6/2[cover]!/6)"), "string")
			assert.equal(cfi.checkType("/6/2[cover]!/6"), false)
		})
		it("determine the type of a cfi", () => {
			const ogcfi = new EpubCFI("epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)")
			const cfi = new EpubCFI()
			assert.equal(cfi.checkType(ogcfi), "EpubCFI")
		})
		it("determine the type of a node", () => {
			const cfi = new EpubCFI()
			const elm = document.createElement("div")
			assert.equal(cfi.checkType(elm), "node")
		})
		it("determine the type of a range", () => {
			const cfi = new EpubCFI()
			const range = document.createRange()
			assert.equal(cfi.checkType(range), "range")
		})
	})
	describe("#compare()", () => {
		it("compare CFIs", () => {
			const epubcfi = new EpubCFI()
			// Spines
			assert.equal(epubcfi.compare(
				"epubcfi(/6/4[cover]!/4)",
				"epubcfi(/6/2[cover]!/4)"
			), 1, "First spine is greater")
			assert.equal(epubcfi.compare(
				"epubcfi(/6/4[cover]!/4)",
				"epubcfi(/6/6[cover]!/4)"
			), -1, "Second spine is greater")
			// First is deeper
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/8/2)",
				"epubcfi(/6/2[cover]!/6)"
			), 1, "First Element is after Second")
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/2)",
				"epubcfi(/6/2[cover]!/6)"
			), -1, "First Element is before Second")
			// Second is deeper
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/8/2)",
				"epubcfi(/6/2[cover]!/6/4/2/2)"
			), 1, "First Element is after Second")
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/4)",
				"epubcfi(/6/2[cover]!/6/4/2/2)"
			), -1, "First Element is before Second")
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/6)",
				"epubcfi(/6/2[cover]!/4/6/8/1:0)"
			), -1, "First is less specific, so is before Second")
			// Same Depth
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/6/8)",
				"epubcfi(/6/2[cover]!/6/2)"
			), 1, "First Element is after Second")
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/20)",
				"epubcfi(/6/2[cover]!/6/10)"
			), -1, "First Element is before Second")
			// Text nodes
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/5)",
				"epubcfi(/6/2[cover]!/4/3)"
			), 1, "First TextNode is after Second")
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/7)",
				"epubcfi(/6/2[cover]!/4/13)"
			), -1, "First TextNode is before Second")
			// Char offset
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/5:1)",
				"epubcfi(/6/2[cover]!/4/5:0)"
			), 1, "First Char Offset after Second")
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/5:2)",
				"epubcfi(/6/2[cover]!/4/5:30)"
			), -1, "Second Char Offset before Second")
			// Normal example
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/8/5:1)",
				"epubcfi(/6/2[cover]!/4/6/15:2)"
			), 1, "First Element after Second")
			assert.equal(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/8/1:0)",
				"epubcfi(/6/2[cover]!/4/8/1:0)"
			), 0, "All Equal")
			// Different Lengths
			assert.equal(epubcfi.compare(
				"epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/10/1:317)",
				"epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/10/2[page18]/1:0)"
			), -1, "First CFI is before Second")
			assert.equal(epubcfi.compare(
				'epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/12/1:0)',
				'epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/12/2/1:9)'
			), -1, "First CFI is before Second")
			assert.equal(epubcfi.compare(
				'epubcfi(/6/16!/4/12/1:0)',
				'epubcfi(/6/16!/4/12/2/1:9)'
			), -1, "First CFI is before Second")
		})
	})
	describe("#fromNode()", () => {
		const base = "/6/4[chap01ref]"
		const contents = require("./fixtures/chapter1-highlights.xhtml").default
		const doc = new DOMParser().parseFromString(contents, "application/xhtml+xml")
		it("get a cfi from a p node", () => {
			const elm = doc.getElementById("c001p0004")
			const cfi = new EpubCFI(elm, base)
			assert.equal(elm.nodeType, Node.ELEMENT_NODE, "provided a element node")
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/10/2[c001p0004])")
		})
		it("get a cfi from a text node", () => {
			const elm = doc.getElementById("c001p0004")
			const txt = elm.childNodes[0]
			const cfi = new EpubCFI(txt, base)
			assert.equal(txt.nodeType, Node.TEXT_NODE, "provided a text node")
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/10/2[c001p0004]/1)")
		})
		it("get a cfi from a text node inside a highlight", () => {
			const elm = doc.getElementById("highlight-1")
			const txt = elm.childNodes[0]
			const cfi = new EpubCFI(txt, base, "annotator-hl")
			assert.equal(txt.nodeType, Node.TEXT_NODE, "provided a text node")
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/32/2[c001p0017]/1)")
		})
		it("get a cfi from a highlight node", () => {
			const txt = doc.getElementById("highlight-1")
			const cfi = new EpubCFI(txt, base, "annotator-hl")
			assert.equal(txt.nodeType, Node.ELEMENT_NODE, "provided a highlight node")
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/32/2[c001p0017])")
		})
	})
	describe("#fromRange()", () => {
		const base = "/6/4[chap01ref]"
		const contentsClean = require("./fixtures/chapter1.xhtml").default
		const doc = new DOMParser().parseFromString(contentsClean, "application/xhtml+xml")
		const contentsHighlights = require("./fixtures/chapter1-highlights.xhtml").default
		const docHighlights = new DOMParser().parseFromString(contentsHighlights, "application/xhtml+xml")
		const highlightContents = require("./fixtures/highlight.xhtml").default
		const docHighlightsAlice = new DOMParser().parseFromString(highlightContents, "application/xhtml+xml")
		it("get a cfi from a collapsed range", () => {
			const t1 = doc.getElementById("c001p0004").childNodes[0]
			const range = doc.createRange()
			range.setStart(t1, 6)
			const cfi = new EpubCFI(range, base)
			assert.equal(cfi.range, false)
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/10/2[c001p0004]/1:6)")
		})
		it("get a cfi from a range", () => {
			const t1 = doc.getElementById("c001p0004").childNodes[0]
			const t2 = doc.getElementById("c001p0007").childNodes[0]
			const range = doc.createRange()
			range.setStart(t1, 6)
			range.setEnd(t2, 27)
			const cfi = new EpubCFI(range, base)
			assert.equal(cfi.range, true)
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2,/10/2[c001p0004]/1:6,/16/2[c001p0007]/1:27)")
		})
		it("get a cfi from a range with offset 0", () => {
			const t1 = doc.getElementById("c001p0004").childNodes[0]
			const range = doc.createRange()
			range.setStart(t1, 0)
			range.setEnd(t1, 1)
			const cfi = new EpubCFI(range, base)
			assert.equal(cfi.range, true)
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/10/2[c001p0004],/1:0,/1:1)")
		})
		it("get a cfi from a range inside a highlight", () => {
			const t1 = docHighlights.getElementById("highlight-1").childNodes[0]
			const range = docHighlights.createRange()
			range.setStart(t1, 6)
			const cfi = new EpubCFI(range, base, "annotator-hl")
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/32/2[c001p0017]/1:43)")
		})
		// TODO: might need to have double ranges in front
		it("get a cfi from a range past a highlight", () => {
			const t1 = docHighlights.getElementById("c001s0001").childNodes[1]
			const range = docHighlights.createRange()
			range.setStart(t1, 25)
			const cfi = new EpubCFI(range, base, "annotator-hl")
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/4/2[c001s0001]/1:41)")
		})
		it("get a cfi from a range in between two highlights", () => {
			const t1 = docHighlightsAlice.getElementById("p2").childNodes[1]
			const range = docHighlightsAlice.createRange()
			range.setStart(t1, 4)
			const cfi = new EpubCFI(range, base, "annotator-hl")
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/4[p2]/1:123)")
		})
		it("correctly count text nodes, independent of any elements present inbetween", () => {
			const t1 = docHighlightsAlice.getElementById("p3").childNodes[2]
			const range = docHighlightsAlice.createRange()
			range.setStart(t1, 4)
			const cfi = new EpubCFI(range, base)
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/6[p3]/3:4)")
		})
	})
	describe("#toRange()", () => {
		const base = "/6/4[chap01ref]"
		const contents = require("./fixtures/chapter1-highlights.xhtml").default
		const doc = new DOMParser().parseFromString(contents, "application/xhtml+xml")
		it("get a range from a cfi", () => {
			const t1 = doc.getElementById("c001p0004").childNodes[0]
			const ogRange = doc.createRange()
			ogRange.setStart(t1, 6)
			const cfi = new EpubCFI(ogRange, base)
			// Check it was parse correctly
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/10/2[c001p0004]/1:6)")
			// Check the range
			const newRange = cfi.toRange(doc)
			assert.equal(newRange.startContainer, t1)
			assert.equal(newRange.startOffset, 6)
			assert.equal(newRange.collapsed, true)
		})
		it("get a range from a cfi with a range", () => {
			const t1 = doc.getElementById("c001p0004").childNodes[0]
			const t2 = doc.getElementById("c001p0007").childNodes[0]
			const ogRange = doc.createRange()
			ogRange.setStart(t1, 6)
			ogRange.setEnd(t2, 27)
			const cfi = new EpubCFI(ogRange, base)
			// Check it was parse correctly
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2,/10/2[c001p0004]/1:6,/16/2[c001p0007]/1:27)")
			// Check the range
			const newRange = cfi.toRange(doc)
			assert.equal(newRange.startContainer, t1)
			assert.equal(newRange.startOffset, 6)
			assert.equal(newRange.endContainer, t2)
			assert.equal(newRange.endOffset, 27)
			assert.equal(newRange.collapsed, false)
		})
		it("get a cfi from a range inside a highlight", () => {
			const t1 = doc.getElementById("highlight-1").childNodes[0]
			const ogRange = doc.createRange()
			ogRange.setStart(t1, 6)
			const cfi = new EpubCFI(ogRange, base, "annotator-hl")
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/32/2[c001p0017]/1:43)")
			// Check the range
			const newRange = cfi.toRange(doc, "annotator-hl")
			assert.ok(newRange.startContainer)
			assert.equal(newRange.startContainer, t1)
			assert.equal(newRange.startOffset, 6)
		})
		it("get a cfi from a range inside a highlight range", () => {
			const t1 = doc.getElementById("highlight-2").childNodes[0]
			const t2 = doc.getElementById("c001s0001").childNodes[1]
			const ogRange = doc.createRange()
			ogRange.setStart(t1, 5)
			ogRange.setEnd(t2, 25)
			const cfi = new EpubCFI(ogRange, base, "annotator-hl")
			assert.equal(cfi.toString(), "epubcfi(/6/4[chap01ref]!/4/2/4/2[c001s0001],/1:5,/1:41)")
			// Check the range
			const newRange = cfi.toRange(doc, "annotator-hl")
			assert.strictEqual(newRange.startContainer.textContent, t1.textContent)
			// assert.strictEqual(newRange.startContainer, t1)
			// assert.equal(newRange.startOffset, 5)
		})
	})
})