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
  const slugifyIds = eleventyConfig.getFilter('slugifyIds')
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
   * Write each page section in the PDF collection to a single HTML file,
   * as well as one instance of SVG symbol definitions
   * @param  {Object} collection collections.pdf with `sectionElement` property
   */
  return async (collection) => {
    const dom = await JSDOM.fromFile(layoutPath)
    const { document } = dom.window

    collection.forEach(({ outputPath, sectionElement, svgSymbolElements }, index) => {
      try {
        // only write SVG symbol definitions one time
        if (index === 0) {
          svgSymbolElements.forEach((svgSymbolElement) => {
            document.body.appendChild(svgSymbolElement)
          })
        }
        document.body.appendChild(sectionElement)
      } catch (error) {
        logger.error(`Eleventy transform for PDF error appending content for ${outputPath} to combined output. ${error}`)
      }
    })

    const trimLeadingSlash = (string) => string.startsWith('/') ? string.substr(1) : string

    /**
     * Rewrite image src attributes to be relative
     */
    document.querySelectorAll('[src]').forEach((asset) => {
      const src = asset.getAttribute('src')
      asset.setAttribute('src', trimLeadingSlash(src))
    })

    document.querySelectorAll('[style*="background-image"]').forEach((element) => {
      const backgroundImageUrl = element.style.backgroundImage.match(/[\(](.*)[\)]/)[1] || ''
      element.style.backgroundImage = `url('${trimLeadingSlash(backgroundImageUrl)}')`
    })

    slugifyIds(document)
    const content = dom.serialize()

    try {
      fs.writeFileSync(outputPath, content)
    } catch (error) {
      logger.error(`Eleventy transform for PDF error writing combined HTML output for PDF. ${error}`)
    }

    const sassOptions = {
      loadPaths: [
        path.resolve('node_modules')
      ]
    }

    try {
      const fontsDir = path.join(inputDir, '_assets', 'fonts')
      const fonts = sass.compile(path.resolve(fontsDir, 'index.scss'), sassOptions)
      fonts.css = fonts.css.replaceAll('/_assets', '_assets')
      const stylesDir = path.join(inputDir, '_assets', 'styles')
      const application = sass.compile(path.resolve(stylesDir, 'application.scss'), sassOptions)
      const custom = sass.compile(path.resolve(stylesDir, 'custom.css'), sassOptions)
      fs.writeFileSync(path.join(outputDir, 'pdf.css'), fonts.css + application.css + custom.css)
    } catch (error) {
      logger.error(`Eleventy transform for PDF error compiling SASS. Error message: ${error}`)
    }
  }
}
