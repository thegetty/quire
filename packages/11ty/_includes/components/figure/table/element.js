const path = require('path')

/**
 * Renders a table from a static html file referenced in a figure
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  Text content of referenced file
 */
module.exports = function (eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.params
  const assetsDir = path.join(eleventyConfig.dir.input, imageDir)
  const renderFile = eleventyConfig.getFilter('renderFile')

  return async function ({ src }) {
    return await renderFile(path.join(assetsDir, src))
  }
}
