const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const jsdom = require('jsdom')
const path = require('path')
const sass = require('sass')

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

  const trimLeadingSlash = (string) => string.startsWith('/') ? string.substr(1) : string

  document.querySelectorAll('[src]').forEach((asset) => {
    const src = asset.getAttribute('src')
    asset.setAttribute('src', trimLeadingSlash(src))
  })

  try {
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeFileSync(outputPath, dom.serialize())
  } catch (errorMessage) {
    error(`Eleventy transform for PDF error writing combined HTML output for PDF. ${errorMessage}`)
  }

  const sassOptions = {
    loadPaths: [
      path.resolve('node_modules')
    ]
  }

  try {
    const application = sass.compile(path.resolve('content', '_assets', 'styles', 'application.scss'), sassOptions)
    const print = sass.compile(path.resolve('content', '_assets', 'styles', 'print.scss'), sassOptions)
    const custom = sass.compile(path.resolve('content', '_assets', 'styles', 'custom.css'), sassOptions)
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeFileSync(path.join('public', 'pdf.css'), application.css + print.css + custom.css)
  } catch (error) {
    error('Eleventy transform for PDF error compiling SASS. Error message: ', error)
  }
}
