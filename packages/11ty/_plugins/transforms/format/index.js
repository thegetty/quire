const path = require('path')
const prettier = require('prettier')

/**
 * An Eleventy transform function to format ouput HTML using Prettier
 * @see https://prettier.io/docs/en/api.html
 *
 * @param      {String}  content
 * @return     {String}  the transformed content
 */
module.exports = function (content) {
  const fileExtension = path.extname(this.outputPath).slice(1)
  let result;
  try {
    result = prettier.format(content, { parser: fileExtension })
  } catch (error) {
    console.error('Eleventy transform error formatting output.\n', error)
  }
  return result || content
}
