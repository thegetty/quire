const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const jsdom = require('jsdom')
const path = require('path')
const sass = require('sass')


/**
 * Nota bene:
 * Output must be written to a directory using Passthrough File Copy
 * @see https://www.11ty.dev/docs/copy/#passthrough-file-copy
 */
module.exports = (eleventyConfig) => {
  const { input, output } = eleventyConfig.dir
  const { JSDOM } = jsdom

  const logger = chalkFactory('transforms:pdf:writer')

  const layoutPath =
    path.join('_plugins', 'transforms', 'outputs', 'pdf', 'layout.html')

  const inputDir = input
  const outputDir = process.env.ELEVENTY_ENV === 'production' ? 'public' : output
  const outputPath = path.join(outputDir, 'pdf.html')

  fs.ensureDirSync(path.parse(outputPath).dir)

  /**
   * Write each page section in the PDF collection to a single HTML file
   * @param  {Object} collection collections.pdf with `sectionElement` property
   */
  return async (collection) => {
    const dom = await JSDOM.fromFile(layoutPath)
    const { document } = dom.window

    collection.forEach(({ outputPath, sectionElement }) => {
      try {
        document.body.appendChild(sectionElement)
      } catch (error) {
        logger.error(`Eleventy transform for PDF error appending content for ${outputPath} to combined output. ${error}`)
      }
    })

    const trimLeadingSlash = (string) => string.startsWith('/') ? string.substr(1) : string

    document.querySelectorAll('[src]').forEach((asset) => {
      const src = asset.getAttribute('src')
      asset.setAttribute('src', trimLeadingSlash(src))
    })

    try {
      fs.writeFileSync(outputPath, dom.serialize())
    } catch (error) {
      logger.error(`Eleventy transform for PDF error writing combined HTML output for PDF. ${error}`)
    }

    const sassOptions = {
      loadPaths: [
        path.resolve('node_modules')
      ]
    }

    try {
      const stylesDir = path.join(inputDir, '_assets', 'styles')
      const application = sass.compile(path.resolve(stylesDir, 'application.scss'), sassOptions)
      const print = sass.compile(path.resolve(stylesDir, 'print.scss'), sassOptions)
      const custom = sass.compile(path.resolve(stylesDir, 'custom.css'), sassOptions)
      fs.writeFileSync(path.join(outputDir, 'pdf.css'), application.css + print.css + custom.css)
    } catch (error) {
      logger.error(`Eleventy transform for PDF error compiling SASS. Error message: ${error}`)
    }
  }
}
