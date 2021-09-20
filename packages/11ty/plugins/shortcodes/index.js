const figure = require ('./figure')
const styleClass = require ('./styleClass')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('qclass', styleClass)
  eleventyConfig.addShortcode('qfigure', figure)
}
