import addComponentTag from './addComponentTag'
import shortcodeFactory from './shortcodeFactory'

// Shortcode components
import components from '../../_includes/components'

/**
 * Define components as universal template shortcodes
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options         options
 */
export default function(eleventyConfig, collections, options) {
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
