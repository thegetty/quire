const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const jsdom = require('jsdom')
const path = require('path')

const { error, warn } = chalkFactory('transforms:epub')

module.exports = async function(collection) {
  // Replace this with a layout template for individual sequence files
  const layoutPath = path.join('_plugins', 'transforms', 'outputs', 'pdf', 'layout.html')
  /**
   * Nota bene:
   * Output must be written to a directory using Passthrough File Copy
   * @see https://www.11ty.dev/docs/copy/#passthrough-file-copy
   */
  const outputPath = path.join('public', 'epub.html')

  const { JSDOM } = jsdom
  const dom = await JSDOM.fromFile(layoutPath)
  const { document } = dom.window

  // Ripped from transforms/pdf/write.js -- these should output to separate sequence files, not appended e.g. ch01.xhtml, ch01s01.xhtml
  collection.forEach(({ outputPath, sectionElement }) => {
    try {
      document.body.appendChild(sectionElement)
    } catch (errorMessage) {
      error(`Eleventy transform for epub error appending content for ${outputPath} to combined output. ${errorMessage}`)
    }
  })

  try {
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeFileSync(outputPath, dom.serialize())
  } catch (errorMessage) {
    error(`Eleventy transform for epub error writing combined HTML output for PDF. ${errorMessage}`)
  }
}
