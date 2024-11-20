const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sass = require('sass')

/**
 * Nota bene:
 * Output must be written to a directory using Passthrough File Copy
 * @see https://www.11ty.dev/docs/copy/#passthrough-file-copy
 */
module.exports = (eleventyConfig) => {
  const { input, output } = eleventyConfig.dir

  const logger = chalkFactory('transforms:pdf:writer')

  const pdfTemplatePath =
    path.join('_layouts', 'pdf.liquid')
  const coversTemplatePath =
    path.join('_layouts', 'pdf-cover-page.liquid')

  const inputDir = input
  const outputDir = process.env.ELEVENTY_ENV === 'production' ? 'public' : output

  const pdfOutputPath = path.join(outputDir, 'pdf.html')
  const coversOutputPath = path.join(outputDir, 'pdf-covers.html')

  fs.ensureDirSync(path.parse(pdfOutputPath).dir)

  /**
   * Render the PDF pages in a liquid layout that merges them into one file
   * Do the same for covers of the PDF pages.
   *  
   * NB: layout will only add SVG symbols once
   * 
   * @param  {Object} collection collections.pdf with `sectionElement`,`svgElements`, and `coverPageData`
   */
  return async (collection) => {

    const publicationHtml = await eleventyConfig.javascriptFunctions.renderFile(pdfTemplatePath,{pages: collection},'liquid')

    const coversMarkups = collection.filter( collex => collex.coverPageData ).map( (collex) => collex.coverPageData )
    const coversHtml = await eleventyConfig.javascriptFunctions.renderFile(coversTemplatePath,{covers: coversMarkups},'liquid')

    try {
      fs.writeFileSync(pdfOutputPath, publicationHtml)
    } catch (error) {
      logger.error(`Eleventy transform for PDF error writing combined HTML output for PDF. ${error}`)
    }

    if (coversMarkups.length > 0) {

      try {
        fs.writeFileSync(coversOutputPath, coversHtml)
      } catch (error) {
        logger.error(`Eleventy transform for PDF error writing covers HTML output for PDF. ${error}`)
      }      
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
