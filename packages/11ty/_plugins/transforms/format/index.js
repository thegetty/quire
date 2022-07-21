const chalkFactory = require('~lib/chalk')
const path = require('path')
const prettier = require('prettier')

const { error } = chalkFactory('transforms:format')

/**
 * An Eleventy transform function to format ouput HTML using Prettier
 * @see https://prettier.io/docs/en/api.html
 *
 * @param      {String}  content
 * @return     {String}  transformed content
 */
module.exports = function (content) {
  let result;
  try {
    result = prettier.format(content, { filepath: this.outputPath })
  } catch (errorMessage) {
    error(`Eleventy transform error formatting output for ${this.outputPath}.\n`, errorMessage)
  }
  return result || content
}
