const assert = require('node:assert')
const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const parser = require('./parser')
const path = require('path')

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
 * 
 * @function validateUserConfig - throws error if user config data is not structured as expected 
 * @throws {Error}
 * 
 * @param {string} type - User configuration type to validate
 * @param {Object} data - Deserialized config data from `config.yaml`, `publication.yaml`, etc
 * 
 * @todo replace with ajv schema validation
 */
const validateUserConfig = (type, data) => {
  switch (type) {
    case 'publication':
      try {
        const { url } = data
        data.url = url.endsWith('/') ? url : url + '/'
        data.pathname = new URL(data.url).pathname
      } catch (errorMessage) {
        logger.error(
          `Publication.yaml url property must be a valid url. Current url value: "${data.url}"`
        )
        throw new Error(errorMessage)
      }
      break
    case 'config': // FIXME: *pretty* sure `strictEqual()` throws, but it's node so double check with bad data
      if ('pdf' in data) {
        // For now just use some quickie type-checking asserts
        assert.strictEqual(typeof data.pdf.outputDir,'string',new TypeError('pdf.outputDir must be a string'))
        assert.strictEqual(typeof data.pdf.filename,'string',new TypeError('pdf.filename must be a string'))
        // FIXME: if pagePDF exists... assert.strictEqual(typeof value.pagePDF,'object',new TypeError("pdf.pagePdf must be an object"))
        // FIXME: assetLinks should be an array of objects if it exists        
      } 
      break
    default:
      break
  }

  return data
}

/**
 * Eleventy plugin to programmatically load global data from files
 * so that it is available to plugins and shortcode components.
 *
 * Nota bene: data is loaded from a sub directory of the `input` directory,
 * distinct from the `eleventyConfig.dir.data` directory.
 *
 * @param {Object} eleventyConfig
 * @param {Object} directoryConfig
 * @property {String} inputDir
 * @property {String} outputDir
 * @property {String} publicDir
 */
module.exports = function(eleventyConfig, directoryConfig) {
  const dir = path.resolve(directoryConfig.inputDir, '_data')
  // console.debug(`[plugins:globalData] ${dir}`)
  const files = fs.readdirSync(dir)
    .filter((file) => path.extname(file) !== '.md')
  const parse = parser(eleventyConfig)

  for (const file of files) {
    const { name: key } = path.parse(file)
    const parsed = parse(path.join(dir, file)) 
    const value = validateUserConfig(key, parsed)
    if (!key || !value) { 
      continue
    }
    checkForDuplicateIds(value, file)
    eleventyConfig.addGlobalData(key, value)
  }

  // Add directory config to globalData so that it is available to other plugins
  eleventyConfig.globalData.directoryConfig = directoryConfig

  return eleventyConfig.globalData
}
