import assert from "assert"
import Packaging from "../src/packaging"

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
            assert.equal(packaging.version, "3.0")
            assert.equal(packaging.metadata.size, 10)
            assert.equal(packaging.manifest.size, 42)
            assert.equal(packaging.spine.size, 13)
        })
    })
})