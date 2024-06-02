import EpubCFI from "../../src/epubcfi"

const assets = (path) => {
    return "../../assets/" + path
}

const load = async (path) => {
    let doc
    await fetch(path).then(res => res.text()).then(text => {
        const parser = new DOMParser()
        doc = parser.parseFromString(text, "application/xhtml+xml")
    })
    return doc
}

describe("EpubCFI", () => {
    let doc1, doc2, doc3
    before(async () => {
        doc1 = await load(assets("chapter1.xhtml"))
        doc2 = await load(assets("chapter1-highlights.xhtml"))
        doc3 = await load(assets("highlight.xhtml"))
    })
    it("parse a cfi on init", () => {
        const cfi = new EpubCFI("epubcfi(/6/2[cover]!/6)")
        expect(cfi.spinePos).to.equal(0) // spinePos is parsed as the first item
    })
    it("parse a cfi and ignore the base if present", () => {
        const cfi = new EpubCFI("epubcfi(/6/2[cover]!/6)", "/6/6[end]")
        expect(cfi.spinePos).to.equal(0) // base is ignored and spinePos is parsed as the first item
    })
    describe("#parse()", () => {
        const cfi = new EpubCFI()
        it("parse a cfi on init", () => {
            const parsed = cfi.parse("epubcfi(/6/2[cover]!/6)")
            expect(parsed.spinePos).to.equal(0) // spinePos is parsed as the first item
        })
        it("parse a cfi and ignore the base if present", () => {
            const parsed = cfi.parse("epubcfi(/6/2[cover]!/6)", "/6/6[end]")
            expect(parsed.spinePos).to.equal(0) // base is ignored and spinePos is parsed as the first item
        })
        it("parse a cfi with a character offset", () => {
            const parsed = cfi.parse("epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)")
            expect(parsed.path.terminal.offset).to.equal(3) // path has a terminal offset of 3
        })
        it("parse a cfi with a range", () => {
            const parsed = cfi.parse("epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)")
            expect(parsed.range).to.equal(true) // range is true
            expect(parsed.start.steps.length).to.equal(2) // start steps are present
            expect(parsed.end.steps.length).to.equal(1) // end steps are present
            expect(parsed.start.terminal.offset).to.equal(1) // start has a terminal offset of 1
            expect(parsed.end.terminal.offset).to.equal(4) // end has a terminal offset of 4
        })
    })
    describe("#toString()", () => {
        it("parse a cfi and write it back", () => {
            const cfi1 = "epubcfi(/6/2[cover]!/6)"
            expect(new EpubCFI(cfi1).toString()).to.equal(cfi1) // output cfi string is same as input
            const cfi2 = "epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)"
            expect(new EpubCFI(cfi2).toString()).to.equal(cfi2)
            const cfi3 = "epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)"
            expect(new EpubCFI(cfi3).toString()).to.equal(cfi3)
        })
    })
    describe("#checkType()", () => {
        it("determine the type of a cfi string", () => {
            const cfi = new EpubCFI()
            expect(cfi.checkType("epubcfi(/6/2[cover]!/6)")).to.equal("string")
            expect(cfi.checkType("/6/2[cover]!/6")).to.equal(undefined)
        })
        it("determine the type of a cfi", () => {
            const ogcfi = new EpubCFI("epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)")
            const cfi = new EpubCFI()
            expect(cfi.checkType(ogcfi)).to.equal("EpubCFI")
        })
        it("determine the type of a node", () => {
            const cfi = new EpubCFI()
            const elm = document.createElement("div")
            expect(cfi.checkType(elm)).to.equal("node")
        })
        it("determine the type of a range", () => {
            const cfi = new EpubCFI()
            const range = document.createRange()
            expect(cfi.checkType(range)).to.equal("range")
        })
    })
    describe("#compare()", () => {
		it("compare CFIs", () => {
			const epubcfi = new EpubCFI()
			//-- Spines
			expect(epubcfi.compare(
				"epubcfi(/6/4[cover]!/4)",
				"epubcfi(/6/2[cover]!/4)"
			)).to.equal(1) // first spine is greater
			expect(epubcfi.compare(
				"epubcfi(/6/4[cover]!/4)",
				"epubcfi(/6/6[cover]!/4)"
			)).to.equal(-1) // second spine is greater
			//-- First is deeper
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/8/2)",
				"epubcfi(/6/2[cover]!/6)"
			)).to.equal(1) // first element is after second
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/2)",
				"epubcfi(/6/2[cover]!/6)"
			)).to.equal(-1) // first element is before second
			//-- Second is deeper
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/8/2)",
				"epubcfi(/6/2[cover]!/6/4/2/2)"
			)).to.equal(1) // first element is after second
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/4)",
				"epubcfi(/6/2[cover]!/6/4/2/2)"
			)).to.equal(-1) // first element is before second
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/6)",
				"epubcfi(/6/2[cover]!/4/6/8/1:0)"
			)).to.equal(-1) // first is less specific, so is before second
			//-- Same Depth
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/6/8)",
				"epubcfi(/6/2[cover]!/6/2)"
			)).to.equal(1) // first element is after second
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/20)",
				"epubcfi(/6/2[cover]!/6/10)"
			)).to.equal(-1) // first element is before second
			//-- Text nodes
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/5)",
				"epubcfi(/6/2[cover]!/4/3)"
			)).to.equal(1) // first TextNode is after second
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/7)",
				"epubcfi(/6/2[cover]!/4/13)"
			)).to.equal(-1) // first TextNode is before second
			//-- Char offset
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/5:1)",
				"epubcfi(/6/2[cover]!/4/5:0)"
			)).to.equal(1) // first char offset after second
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/5:2)",
				"epubcfi(/6/2[cover]!/4/5:30)"
			)).to.equal(-1) // second char offset before second
			//-- Normal example
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/8/5:1)",
				"epubcfi(/6/2[cover]!/4/6/15:2)"
			)).to.equal(1) // first element after second
			expect(epubcfi.compare(
				"epubcfi(/6/2[cover]!/4/8/1:0)",
				"epubcfi(/6/2[cover]!/4/8/1:0)"
			)).to.equal(0) // all equal
			//-- Different Lengths
			expect(epubcfi.compare(
				"epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/10/1:317)",
				"epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/10/2[page18]/1:0)"
			)).to.equal(-1) // first CFI is before second
			expect(epubcfi.compare(
				'epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/12/1:0)',
				'epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/12/2/1:9)'
			)).to.equal(-1) // first CFI is before second
			expect(epubcfi.compare(
				'epubcfi(/6/16!/4/12/1:0)',
				'epubcfi(/6/16!/4/12/2/1:9)'
			)).to.equal(-1) // first CFI is before second
		})
	})
    describe("#fromNode()", () => {
		const base = "/6/4[chap01ref]"
		it("get a cfi from a p node", () => {
			const elm = doc2.getElementById("c001p0004")
			const cfi = new EpubCFI(elm, base)
			expect(elm.nodeType).to.equal(Node.ELEMENT_NODE) // provided a element node
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/10/2[c001p0004])")
		})
		it("get a cfi from a text node", () => {
			const elm = doc2.getElementById("c001p0004")
			const txt = elm.childNodes[0]
			const cfi = new EpubCFI(txt, base)
			expect(txt.nodeType).to.equal(Node.TEXT_NODE) // provided a text node
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/10/2[c001p0004]/1)")
		})
		it("get a cfi from a text node inside a highlight", () => {
			const elm = doc2.getElementById("highlight-1")
			const txt = elm.childNodes[0]
			const cfi = new EpubCFI(txt, base, "annotator-hl")
			expect(txt.nodeType).to.equal(Node.TEXT_NODE) // provided a text node
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/32/2[c001p0017]/1)")
		})
		it("get a cfi from a highlight node", () => {
			const txt = doc2.getElementById("highlight-1")
			const cfi = new EpubCFI(txt, base, "annotator-hl")
			expect(txt.nodeType).to.equal(Node.ELEMENT_NODE) // provided a highlight node
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/32/2[c001p0017])")
		})
	})
    describe("#fromRange()", () => {
		const base = "/6/4[chap01ref]"
		it("get a cfi from a collapsed range", () => {
			const t1 = doc1.getElementById("c001p0004").childNodes[0]
			const range = doc1.createRange()
			range.setStart(t1, 6)
			const cfi = new EpubCFI(range, base)
			expect(cfi.range).to.equal(false)
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/10/2[c001p0004]/1:6)")
		})
		it("get a cfi from a range", () => {
			const t1 = doc1.getElementById("c001p0004").childNodes[0]
			const t2 = doc1.getElementById("c001p0007").childNodes[0]
			const range = doc1.createRange()
			range.setStart(t1, 6)
			range.setEnd(t2, 27)
			const cfi = new EpubCFI(range, base)
			expect(cfi.range).to.equal(true)
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2,/10/2[c001p0004]/1:6,/16/2[c001p0007]/1:27)")
		})
		it("get a cfi from a range with offset 0", () => {
			const t1 = doc1.getElementById("c001p0004").childNodes[0]
			const range = doc1.createRange()
			range.setStart(t1, 0)
			range.setEnd(t1, 1)
			const cfi = new EpubCFI(range, base)
			expect(cfi.range).to.equal(true)
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/10/2[c001p0004],/1:0,/1:1)")
		})
		it("get a cfi from a range inside a highlight", () => {
			const t1 = doc2.getElementById("highlight-1").childNodes[0]
			const range = doc2.createRange()
			range.setStart(t1, 6)
			const cfi = new EpubCFI(range, base, "annotator-hl")
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/32/2[c001p0017]/1:43)")
		})
		// TODO: might need to have double ranges in front
		it("get a cfi from a range past a highlight", () => {
			const t1 = doc2.getElementById("c001s0001").childNodes[1]
			const range = doc2.createRange()
			range.setStart(t1, 25)
			const cfi = new EpubCFI(range, base, "annotator-hl")
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/4/2[c001s0001]/1:41)")
		})
		it("get a cfi from a range in between two highlights", () => {
			const t1 = doc3.getElementById("p2").childNodes[1]
			const range = doc3.createRange()
			range.setStart(t1, 4)
			const cfi = new EpubCFI(range, base, "annotator-hl")
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/4[p2]/1:123)")
		})
		it("correctly count text nodes, independent of any elements present inbetween", () => {
			const t1 = doc3.getElementById("p3").childNodes[2]
			const range = doc3.createRange()
			range.setStart(t1, 4)
			const cfi = new EpubCFI(range, base)
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/6[p3]/3:4)")
		})
	})
    describe("#toRange()", () => {
		const base = "/6/4[chap01ref]"
		const ignoreClass = "annotator-hl"
		it("get a range from a cfi", () => {
			const t1 = doc2.getElementById("c001p0004").childNodes[0]
			const ogRange = doc2.createRange()
			ogRange.setStart(t1, 6)
			const cfi = new EpubCFI(ogRange, base)
			// Check it was parse correctly
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/10/2[c001p0004]/1:6)")
			// Check the range
			const newRange = cfi.toRange(doc2)
			expect(newRange.startContainer).to.equal(t1)
			expect(newRange.startOffset).to.equal(6)
			expect(newRange.collapsed).to.equal(true)
		})
		it("get a range from a cfi with a range", () => {
			const t1 = doc2.getElementById("c001p0004").childNodes[0]
			const t2 = doc2.getElementById("c001p0007").childNodes[0]
			const ogRange = doc2.createRange()
			ogRange.setStart(t1, 6)
			ogRange.setEnd(t2, 27)
			const cfi = new EpubCFI(ogRange, base)
			// Check it was parse correctly
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2,/10/2[c001p0004]/1:6,/16/2[c001p0007]/1:27)")
			// Check the range
			const newRange = cfi.toRange(doc2)
			expect(newRange.startContainer).to.equal(t1)
			expect(newRange.startOffset).to.equal(6)
			expect(newRange.endContainer).to.equal(t2)
			expect(newRange.endOffset).to.equal(27)
			expect(newRange.collapsed).to.equal(false)
		})
		it.skip("get a cfi from a range inside a highlight", () => {
			const t1 = doc2.getElementById("highlight-1").childNodes[0]
			const ogRange = doc2.createRange()
			ogRange.setStart(t1, 6)
			const cfi = new EpubCFI(ogRange, base, ignoreClass)
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/32/2[c001p0017]/1:43)")
			// Check the range
			const newRange = cfi.toRange(doc2, ignoreClass)
			expect(newRange.startContainer).to.equal(t1)
			expect(newRange.startContainer.textContent).to.equal(t1.textContent)
			expect(newRange.startOffset).to.equal(6)
			expect(newRange.collapsed).to.equal(true)
		})
		it.skip("get a cfi from a range inside a highlight range", () => {
			const t1 = doc2.getElementById("highlight-2").childNodes[0]
			const t2 = doc2.getElementById("c001s0001").childNodes[1]
			const ogRange = doc2.createRange()
			ogRange.setStart(t1, 5)
			ogRange.setEnd(t2, 25)
			const cfi = new EpubCFI(ogRange, base, ignoreClass)
			expect(cfi.toString()).to.equal("epubcfi(/6/4[chap01ref]!/4/2/4/2[c001s0001],/1:5,/1:41)")
			// Check the range
			const newRange = cfi.toRange(doc2, ignoreClass)
			expect(newRange.startContainer).to.equal(t1)
			expect(newRange.startContainer.textContent).to.equal(t1.textContent)
			expect(newRange.startOffset).to.equal(5)
			expect(newRange.endContainer).to.equal(t2)
			expect(newRange.endContainer.textContent).to.equal(t2.textContent)
			expect(newRange.endOffset).to.equal(25)
			expect(newRange.collapsed).to.equal(false)
		})
	})
    describe("#isCfiString()", () => {
		it("checking if a string is wrapped with 'epubcfi()'", () => {
			const cfi = new EpubCFI()
			expect(cfi.isCfiString("epubcfi(/6/4[chap01ref]!/4/2,/10/2[c001p0004]/1:6,/16/2[c001p0007]/1:27)")).to.equal(true)
		})
	})
})