const addComponentTag = require('./addComponentTag')
const addShortcode = require('./addShortcode')

// Shortcode components
const components = require('../../_includes/components')

/**
 * Define components as universal template shortcodes
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options         options
 */
module.exports = function(eleventyConfig, options) {
  for (const component in components) {
    switch(component) {
      default:
        addComponentTag(eleventyConfig, `${component}`, components[component])
        break;
      case 'lightbox':
      case 'modal':
        addShortcode(eleventyConfig, `${component}`, components[component])
        break;
    }
  }
}
