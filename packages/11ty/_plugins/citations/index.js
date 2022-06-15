const formatCitationFn = require('./formatCitation')

module.exports = function (eleventyConfig, options) {
  eleventyConfig.addJavaScriptFunction('formatCitation', formatCitationFn(options))
}
