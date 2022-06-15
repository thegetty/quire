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
  return prettier.format(content)
}
