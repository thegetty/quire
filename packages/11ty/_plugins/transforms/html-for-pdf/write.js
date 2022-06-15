const fs = require('fs-extra')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const path = require('path')

/**
 * Write each page section in the PDF collection to a single HTML file
 * @param  {Object} collection collections.pdf with `sectionContent` property
 */
const outputPath = path.join('temp', 'pdf.html')
const layoutPath = path.join('_plugins', 'transforms', 'html-for-pdf', 'layout.html')

module.exports = function(collection) {
  const layout = fs.readFileSync(layoutPath)
  const { document: doc } = new JSDOM(layout).window
  collection.forEach(({ sectionContent }) => {
    doc.body.appendChild(sectionContent)
  })
  try {
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeFileSync(outputPath, doc.documentElement.outerHTML)
  } catch(error) {
    console.error(`Eleventy transform error writing combined HTML output for PDF. Error message: `, error)
  }
}
