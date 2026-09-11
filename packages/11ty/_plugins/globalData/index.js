import { validateUserConfig } from './validator.js'
import chalkFactory from '#lib/chalk/index.js'
import fs from 'fs-extra'
import parser from './parser.js'
import path from 'node:path'

const logger = chalkFactory('[plugins:globalData]')

/**
 * Throws an error if data contains duplicate ids
 * @param  {Object|Array} data
 */
const validateObjectIds = function (data, filename, key = '') {
  if (!data) return

  if (Array.isArray(data)) {
    const isObject = data.length > 0 && data.some((item) => typeof item === 'object' && Object.hasOwn(item, 'id'))
    if (isObject) {
      const isMissingId = data.some((item) => !item?.id)
      if (isMissingId) {
        throw new Error(`${filename}: "${key}" contains an entry with no "id".`)
      }

      const duplicates = data.filter((a, index) => {
        return index !== data.findIndex((b) => b.id === a.id)
      })

      if (duplicates.length) {
        const ids = duplicates.map(({ id }) => id)
        throw new Error(`${filename}: "${key}" contains duplicate ids: ${ids.join(', ')}.`)
      }
    }
  }

  if (typeof data === 'object') {
    Object.keys(data).forEach((key) => {
      validateObjectIds(data[key], filename, key)
    })
  }
}

/**
 * Eleventy plugin to programmatically load global data from files
 * so that it is available to plugins and shortcode components.
 *
 * Nota bene: data is loaded from a sub directory of the `input` directory,
 * distinct from the `eleventyConfig.directoryAssignments.data` directory.
 *
 * @param {Object} eleventyConfig
 * @param {Object} directoryConfig
 * @property {String} inputDir
 * @property {String} outputDir
 * @property {String} publicDir
 */
export default function (eleventyConfig, directoryConfig) {
  const dir = path.resolve(directoryConfig.inputDir, '_data')

  // Add directory config to globalData so that it is available to other plugins
  eleventyConfig.addGlobalData('directoryConfig', directoryConfig)

  if (!fs.existsSync(dir)) return eleventyConfig.globalData

  const files = fs.readdirSync(dir)
    .filter((file) => path.extname(file) !== '.md')
  const parse = parser(eleventyConfig)

  for (const file of files) {
    const { name: key } = path.parse(file)
    const parsed = parse(path.join(dir, file))

    let value
    try {
      value = validateUserConfig(key, parsed)
      validateObjectIds(value, file, key)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }

    if (!key || !value) {
      continue
    }
    eleventyConfig.addGlobalData(key, value)
  }

  return eleventyConfig.globalData
}
