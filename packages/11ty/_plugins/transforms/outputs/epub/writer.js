import chalkFactory from '#lib/chalk/index.js'
import fs from 'fs-extra'
import path from 'node:path'

const logger = chalkFactory('_plugins:epub:write')

/**
 * Writes EPUB files
 * @param  {String} content Serialized DOM content
 */
export default (outputDir) => {
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
