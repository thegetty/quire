const markdownify = require('./markdownify')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addFilter('markdownify', markdownify)
}
