const createCitation = require('./createCitation')

module.exports = function (eleventyConfig) {
  eleventyConfig.addJavaScriptFunction('createCitation', createCitation)
}
