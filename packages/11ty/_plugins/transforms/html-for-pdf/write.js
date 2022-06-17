const fs = require('fs-extra')
const jsdom = require('jsdom')
const path = require('path')

/**
 * Write each page section in the PDF collection to a single HTML file
 * @param  {Object} collection collections.pdf with `sectionContent` property
 */
const layoutPath = path.join('_plugins', 'transforms', 'html-for-pdf', 'layout.html')
const outputPath = path.join('_site', 'pdf.html')

module.exports = function(collection) {
  const layout = fs.readFileSync(layoutPath)

  const { JSDOM } = jsdom
  const { document } = new JSDOM(layout).window

  collection.forEach(({ sectionContent }) => {
    document.body.appendChild(sectionContent)
  })

  try {
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeFileSync(outputPath, document.documentElement.outerHTML)
  } catch(error) {
    console.error(`Eleventy transform error writing combined HTML output for PDF. Error message: `, error)
  }
}
