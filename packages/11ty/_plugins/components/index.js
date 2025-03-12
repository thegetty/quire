import addComponentTag from './addComponentTag.js'
import shortcodeFactory from './shortcodeFactory.js'

// Shortcode components
import * as components from '../../_includes/components/index.js'

/**
 * Define components as universal template shortcodes
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options         options
 */
export default function (eleventyConfig, collections, options) {
  const { addShortcode } = shortcodeFactory(eleventyConfig, collections)

  for (const component in components) {
    switch (component) {
      case 'lightbox':
      case 'modal':
        addShortcode(`${component}`, components[component])
        break
      default:
        addComponentTag(eleventyConfig, `${component}`, components[component])
        break
    }
  }
}
