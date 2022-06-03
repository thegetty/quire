const formatCitation = require('./formatCitation')

module.exports = function (eleventyConfig) {
  eleventyConfig.addJavaScriptFunction('formatCitation', formatCitation)
}
