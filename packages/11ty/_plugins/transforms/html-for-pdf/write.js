const fs = require('fs-extra')
const jsdom = require('jsdom')
const path = require('path')

/**
 * Write each page section in the PDF collection to a single HTML file
 * @param  {Object} collection collections.pdf with `sectionElement` property
 */
const layoutPath = path.join('_plugins', 'transforms', 'html-for-pdf', 'layout.html')
const outputPath = path.join('_site', 'pdf.html')

module.exports = function(collection) {
  const layout = fs.readFileSync(layoutPath)

  const { JSDOM } = jsdom
  const { document } = new JSDOM(layout).window

  collection.forEach(({ outputPath, sectionElement }) => {
    try {
      document.body.appendChild(sectionElement)
    } catch (error) {
      console.warn(`Eleventy transform html-for-pdf: <section> element not found for ${output}`, error)
    }
  })

  try {
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeFileSync(outputPath, document.documentElement.outerHTML)
  } catch(error) {
    console.error(`Eleventy transform html-for-pdf error writing combined HTML output for PDF. Error message: `, error)
  }
}
