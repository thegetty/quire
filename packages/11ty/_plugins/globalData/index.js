const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')

const logger = chalkFactory('_plugins:globalData')

/**
 * Throws an error if data contains duplicate ids
 * @param  {Object|Array} data
 */
const checkForDuplicateIds = function (data, filename) {
  if (!data) return

  if (Array.isArray(data)) {
    if (data.every((item) => item.hasOwnProperty('id'))) {
      const duplicates = data.filter((a, index) => {
        return index !== data.findIndex((b) => b.id === a.id)
      })
      if (duplicates.length) {
        const ids = duplicates.map(({ id }) => id)
        throw new Error(`Duplicates ids: ${ids.join(', ')}`)
      }
    }
  }

  if (typeof data === 'object') {
    Object.keys(data).forEach((key) => {
      try {
        checkForDuplicateIds(data[key])
      } catch (error) {
        logger.error(`${filename} ${key} contains multiple entries with the same id.\nEach entry in ${key} must have a unique id. ${error.message}`)
      }
    })
  }
}

module.exports = function(eleventyConfig) {
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
      if (extension && extension.parser) {
        const { options, parser } = extension
        const input = options.read ? fs.readFileSync(filePath) : filePath
        return parser(input)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  const directory = path.join('content', '_data')
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const { name: key } = path.parse(file)
    const value = data(file)

    if (key && value) {
      checkForDuplicateIds(value, file)
      eleventyConfig.addGlobalData(key, value)
    }
  }
}
