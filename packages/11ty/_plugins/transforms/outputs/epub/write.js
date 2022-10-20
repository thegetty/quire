const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')

const logger = chalkFactory('_plugins:epub:write')

/**
 * Writes EPUB files
 * @param  {String} content Serialized DOM content
 */
module.exports = (outputPath, content) => {
  try {
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeFileSync(outputPath, content)
  } catch (error) {
    logger.error(`Error writing EPUB file ${filename}. ${error}`)
  }
}
