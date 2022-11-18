const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const parser = require('./parser')

const logger = chalkFactory('[plugins:globalData]')

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
 * Eleventy plugin to programmatically load global data from files
 * so that it is available to shortcode components.
 * Nota bene: data is loaded from a sub directory of the `input` directory,
 * distinct from the `eleventyConfig.dir.data` directory.
 */
module.exports = {
  configFunction: function(eleventyConfig, options = {}) {
    const dir = path.resolve(eleventyConfig.dir.input, '_data')
    // console.debug(`[plugins:globalData] ${dir}`)
    const files = fs.readdirSync(dir)
      .filter((file) => path.extname(file) !== '.md')
    const parse = parser(eleventyConfig)

    for (const file of files) {
      const { name: key } = path.parse(file)
      const value = parse(path.join(dir, file))
      if (key && value) {
        checkForDuplicateIds(value, file)
        eleventyConfig.addGlobalData(key, value)
      }
    }
  },
  initArguments: {}
}
