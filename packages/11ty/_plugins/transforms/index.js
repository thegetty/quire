const applyPDFTransform = require('./pdf')

module.exports = function (eleventyConfig, collections) {
  applyPDFTransform(eleventyConfig, collections)
}
