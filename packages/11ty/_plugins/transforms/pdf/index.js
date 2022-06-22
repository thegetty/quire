const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const transform = require('./transform')

/**
 * Eleventy plugin to output HTML specific for PDF generation
 *
 * @param      {Object}  eleventyConfig  Eleventy configuration
 * @param      {Object}  collections  Eleventy collections
 */
module.exports = function(eleventyConfig, { collections }) {
  const outputDir = eleventyConfig.dir.output

  /**
   * Nota bene:
   * call transform with `this` context to ensure we have `this.outputPath`
   */
  eleventyConfig.addTransform('pdf', function (content) {
    return transform.call(this, collections, content)
  })

  /**
   * Register an event hook to copy HTML for PDF to ouput directory
   * @see https://www.11ty.dev/docs/events/#eleventy.after
   */
  eleventyConfig.on('eleventy.after', () => {
    try {
      const source = path.join('_temp', 'pdf.html')
      const destination = path.join(outputDir, 'pdf.html')
      fs.copyFileSync(source, destination)
      console.warn(chalk.magenta(`Eleventy transforms/pdf: Copied ${source} to ${destination}`))
    } catch (error) {
      const message = `Unable to copy ${source} to ${destination}`
      console.warn(chalk.yellow(message, error))
    }
  })
}
