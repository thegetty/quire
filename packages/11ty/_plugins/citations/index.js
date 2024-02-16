import formatCitationFn from './formatCitation.js'

export default function(eleventyConfig, options) {
  eleventyConfig.addJavaScriptFunction('formatCitation', formatCitationFn(options))
}
