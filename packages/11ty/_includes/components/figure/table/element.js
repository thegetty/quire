const path = require('path')

module.exports = function (eleventyConfig) {
  const assetsDir = path.join(eleventyConfig.dir.input, '_assets/images')
  const renderFile = eleventyConfig.getFilter('renderFile')

  return async function ({ src }) {
    return await renderFile(path.join(assetsDir, src))
  }
}
