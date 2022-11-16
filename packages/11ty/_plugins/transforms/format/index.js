const chalkFactory = require('~lib/chalk')
const path = require('path')
const prettier = require('prettier')

const logger = chalkFactory('transforms:format')

/**
 * An Eleventy transform function to format ouput HTML using Prettier
 * @see https://prettier.io/docs/en/api.html
 *
 * @param      {String}  content
 * @return     {String}  transformed content
 */
module.exports = async function (content) {
  let result
  try {
    result = await prettier.format(content, { filepath: this.outputPath })
  } catch (error) {
    logger.error(`Eleventy transform error formatting output for ${this.outputPath}.\n${error}`)
  }
  return result || content
}
