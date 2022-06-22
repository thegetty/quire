const chalk = require('chalk')
const fs = require('fs-extra')
const jsdom = require('jsdom')
const path = require('path')

/**
 * Write each page section in the PDF collection to a single HTML file
 * @param  {Object} collection collections.pdf with `sectionElement` property
 */
const layoutPath = path.join('_plugins', 'transforms', 'pdf', 'layout.html')
const outputPath = path.join('_temp', 'pdf.html')

module.exports = function(collection) {
  const layout = fs.readFileSync(layoutPath)

  const { JSDOM } = jsdom
  const { document } = new JSDOM(layout).window

  collection.forEach(({ outputPath, sectionElement }) => {
    try {
      document.body.appendChild(sectionElement)
    } catch (error) {
      const message = `Eleventy transform for PDF could not find a <section> element for ${output}. Error message: `
      console.warn(chalk.yellow(message), error)
    }
  })

  try {
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeFileSync(outputPath, document.documentElement.outerHTML)
  } catch (error) {
    const message = 'Eleventy transform for PDF error writing combined HTML output for PDF. Error message: '
    console.error(chalk.red(message), error)
  }
}
