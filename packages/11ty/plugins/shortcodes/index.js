const figure require ('./shortcodes/figure')
const styleClass require ('./shortcodes/class')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('q-class', styleClass)
  eleventyConfig.addShortcode('q-figure', figure)
}
