const camelize = require('camelize')
const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')

const logger = chalkFactory('_plugins:globalData')

module.exports = function(eleventyConfig) {
  // eleventyConfig.addGlobalData('env', process.env)

  const data = (file) => {
    const { base, ext, name } = path.parse(file)
    const fileExt = ext.slice(1)
    const filePath = path.join(directory, file)
    /**
     * @typedef {Map<String, Object>} dataExtensions
     * Maps an extension string to an extension properties object
     * @property {String} extension
     * @property {Function} parser
     * @property {Object} options
     */
    const extension = eleventyConfig.dataExtensions.get(fileExt)

    try {
      const { options, parser } = extension
      const input = options.read ? fs.readFileSync(filePath) : filePath
      return parser && parser(input)
    } catch (error) {
      logger.error(filePath, error)
    }
  }

  const directory = path.join('content', '_data')
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const { name: key } = path.parse(file)
    const value = data(file) // camelize(data(file))
    if (key && value) {
      eleventyConfig.addGlobalData(key, value)
    }
  }
}
