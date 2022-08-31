const path = require('path')

module.exports = function (eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.params
  const assetsDir = path.join(eleventyConfig.dir.input, imageDir)
  const renderFile = eleventyConfig.getFilter('renderFile')

  return async function ({ src }) {
    return await renderFile(path.join(assetsDir, src))
  }
}
