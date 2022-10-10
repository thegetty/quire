const fs = require('fs-extra')
const path = require('path')

/**
 * Writes EPUB files
 * @param  {String} content Serialized DOM content
 */
module.exports = (filename, content) => {
  const outputDir = process.env.ELEVENTY_ENV === 'production' ? 'public' : '_site'
  const outputPath = path.join(outputDir, 'epub', filename)
  try {
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeFileSync(outputPath, content)
  } catch (error) {
    logger.error(`Eleventy transform for EPUB error writing combined HTML output for EPUB. ${error}`)
  }
}
