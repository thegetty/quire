const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')

const logger = chalkFactory('_plugins:epub:write')

/**
 * Writes EPUB files
 * @param  {String} content Serialized DOM content
 */
module.exports = (outputDir) => {
  return (outputPath, content) => {
    const dest = path.join(outputDir, outputPath)
    try {
      fs.ensureDirSync(path.parse(dest).dir)
      fs.writeFileSync(dest, content)
    } catch (error) {
      logger.error(`Error writing EPUB file ${dest}. ${error}`)
    }
  }
}
