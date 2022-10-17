const fs = require('fs-extra')
const path = require('path')

/**
 * A proxy method for parsing Eleventy data extensions
 *
 * @param  {EleventyConfig}  eleventyConfig  The eleventy configuration
 *
 * @return  {Function}  A proxy method to parse an Eleventy data file
 */
module.exports = function(eleventyConfig) {
  /**
   * @typedef {Map<String, Object>} dataExtensions
   * Maps an extension string to an extension properties object
   * @property {String} extension
   * @property {Function} parser
   * @property {Object} options
   */
  const { dataExtensions } = eleventyConfig

  return (filePath) => {
    const { base, ext, name } = path.parse(filePath)
    const fileExt = ext.slice(1)

    const extension = dataExtensions.get(fileExt)

    try {
      if (extension && extension.parser) {
        const { options, parser } = extension
        const input = options.read ? fs.readFileSync(filePath) : filePath
        return parser(input)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}