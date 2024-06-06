const fs = require("node:fs")
const path = require("path")
const jsdoc2md = require("jsdoc-to-markdown")
const output = (dir, filename, data) => {
    try {
        fs.mkdirSync(dir, { recursive: true }, err => {
            if (err) throw err
        })
        const ws = fs.createWriteStream(filename)
        ws.write(data)
    } catch (e) {
        console.error(e)
    }
}

const docs = [
    "annotations",
    "archive",
    "book",
    "container",
    "contents",
    "epub",
    "epubcfi",
    "layout",
    "locations",
    "managers/continuous/index",
    "managers/default/index",
    "managers/helpers/snap",
    "managers/helpers/stage",
    "managers/views/iframe",
    "mapping",
    "navigation",
    "packaging",
    "pagelist",
    "rendition",
    "resources",
    "section",
    "spine",
    "store",
    "themes",
    "utils/constants",
    "utils/core",
    "utils/hook",
    "utils/mime",
    "utils/path",
    "utils/replacements",
    "utils/request",
    "utils/scrolltype",
    "utils/queue",
    "utils/url"
]

for (const doc of docs) {
    const time = Date.now()
    const item = doc.split('/')
    let opath = path.resolve(__dirname, "docs/API")
    let ifile = "src"
    let ofile = opath
    for (let i = 0, len = item.length; i < len; ++i) {
        if (i === (len - 1)) {
            ifile = path.join(ifile, item[i]) + ".js"
            ofile = path.join(ofile, item[i]) + ".md"
        } else {
            opath = path.join(opath, item[i])
            ifile = path.join(ifile, item[i])
            ofile = path.join(ofile, item[i])
        }
    }
    jsdoc2md.render({ files: ifile, "heading-depth": 1 }).then(data => {
        output(opath, ofile, data)
        const t = (Date.now() - time).toString().padStart(3)
        console.log("output [time:%s ms, path:%s]", t, ofile)
    })
}