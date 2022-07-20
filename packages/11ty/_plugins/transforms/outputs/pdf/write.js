const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const jsdom = require('jsdom')
const path = require('path')

const { error, warn } = chalkFactory('transforms:pdf')

/**
 * Write each page section in the PDF collection to a single HTML file
 * @param  {Object} collection collections.pdf with `sectionElement` property
 */
module.exports = async function(collection) {
  const layoutPath = path.join('_plugins', 'transforms', 'outputs', 'pdf', 'layout.html')
  /**
   * Nota bene:
   * Output must be written to a directory using Passthrough File Copy
   * @see https://www.11ty.dev/docs/copy/#passthrough-file-copy
   */
  const outputPath = path.join('public', 'pdf.html')

  const { JSDOM } = jsdom
  const dom = await JSDOM.fromFile(layoutPath)
  const { document } = dom.window

  collection.forEach(({ outputPath, sectionElement }) => {
    try {
      document.body.appendChild(sectionElement)
    } catch (errorMessage) {
      error(`Eleventy transform for PDF error appending content for ${outputPath} to combined output. ${errorMessage}`)
    }
  })

  try {
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeFileSync(outputPath, dom.serialize())
  } catch (errorMessage) {
    error(`Eleventy transform for PDF error writing combined HTML output for PDF. ${errorMessage}`)
  }
}
