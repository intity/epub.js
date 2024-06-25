import Packaging from "../../src/packaging"

describe("Packaging", () => {
    let packageXML, packaging
    before(async () => {
        packageXML = await fetch("/assets/alice/OPS/package.opf")
            .then(r => r.text())
            .then(t => {
                return new window.DOMParser()
                    .parseFromString(t, "text/xml")
            })
        packaging = new Packaging()
    })
    describe("#parse()", () => {
        it ("parse package.opf from xmldom", () => {
            packaging.parse(packageXML)
            expect(packaging.version).to.equal("3.0")
            expect(packaging.metadata.size).to.equal(10)
            expect(packaging.manifest.size).to.equal(42)
            expect(packaging.spine.size).to.equal(13)
        })
    })
})