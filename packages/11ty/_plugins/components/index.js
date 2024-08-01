const addComponentTag = require('./addComponentTag')
const shortcodeFactory = require('./shortcodeFactory')

// Shortcode components
const components = require('../../_includes/components')

/**
 * Define components as universal template shortcodes
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options         options
 */
module.exports = function(eleventyConfig, collections, options) {
  const { addShortcode } = shortcodeFactory(eleventyConfig, collections)

  for (const component in components) {
    switch(component) {
      default:
        addComponentTag(eleventyConfig, `${component}`, components[component])
        break
      case 'lightbox':
      case 'modal':
        addShortcode(`${component}`, components[component])
        break
    }
  }
}
