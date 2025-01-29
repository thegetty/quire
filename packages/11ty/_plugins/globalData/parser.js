import chalkFactory from '#lib/chalk/index.js'
import fs from 'fs-extra'
import path from 'node:path'

const logger = chalkFactory('globalData:parser')

/**
 * A proxy method for parsing Eleventy data extensions
 *
 * @param  {EleventyConfig}  eleventyConfig  The eleventy configuration
 *
 * @return  {Function}  A proxy method to parse an Eleventy data file
 */
export default function (eleventyConfig) {
  /**
   * @typedef {Map<String, Object>} dataExtensions
   * Maps an extension string to an extension properties object
   * @property {String} extension
   * @property {Function} parser
   * @property {Object} options
   */
  const { dataExtensions } = eleventyConfig

  return (filePath) => {
    const { ext } = path.parse(filePath)
    const fileExt = ext.slice(1)
    const extension = dataExtensions.get(fileExt)
    try {
      if (extension && extension.parser) {
        const { options, parser } = extension
        const input = options && options.read
          ? fs.readFileSync(filePath)
          : filePath
        return parser(input)
      } else {
        logger.warn(`Unable to parse ${filePath}\nNo data extension is configured for '.${fileExt}' data files`)
      }
    } catch (error) {
      logger.error(`Error parsing ${filePath} ${error}`)
    }
  }
}
