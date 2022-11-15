const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const parser = require('./parser')

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

/**
 * Programmatically load global data from files
 *
 * Nota bene: data is not loaded from the `eleventyConfig.dir.data` directory
 *
 * @param  {EleventyConfig}  eleventyConfig
 */
module.exports = function(eleventyConfig) {
  const dataDir = path.resolve(eleventyConfig.dir.input, '_data')
  const files = fs.readdirSync(dataDir)
  const parseFile = parser(eleventyConfig)

  for (const file of files) {
    const { name: key } = path.parse(file)
    const value = parseFile(path.join(dataDir, file))

    if (key && value) {
      checkForDuplicateIds(value, file)
      eleventyConfig.addGlobalData(key, value)
    }
  }
}
