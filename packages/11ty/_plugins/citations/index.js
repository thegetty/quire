const formatCitationFn = require('./formatCitation')

export default function(eleventyConfig, options) {
  eleventyConfig.addJavaScriptFunction('formatCitation', formatCitationFn(options))
}
