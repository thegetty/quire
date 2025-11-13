/**
 * Adds a custom tag for a shortcode component.
 *
 * Shortcodes are added for all template languages. This is a simple wrapper
 * around `eleventyConfig.addShortcode() or addPairedShortcode()`, providing `page` data to component.
 * @see ./addComponentTag.js to add custom tags with keyword arguments.
 *
 * @param  {Object}  eleventyConfig  The Eleventy configuration instance
 * @param  {Object}  component       A JavaScript shortcode component
 * @param  {String}  tagName         A template tag name for the component
 */
export default function (eleventyConfig) {
  return {
    addShortcode: function (tagName, component) {
      eleventyConfig.addShortcode(tagName, function (...args) {
        // Pass access from the internal collections environment to shortcodes
        const collections = this.ctx?.environments?.collections ?? {}
        const page = collections.all?.find(({ inputPath }) => inputPath === this.page.inputPath)

        return component(eleventyConfig, { collections, page }).bind(this)(...args)
      })
    },
    addPairedShortcode: function (tagName, component) {
      eleventyConfig.addPairedShortcode(tagName, function (content, ...args) {
        const collections = this.ctx?.environments?.collections ?? {}
        const page = collections.all?.find(({ inputPath }) => inputPath === this.page.inputPath)

        return component(eleventyConfig, { collections, page })(content, ...args)
      })
    }
  }
}
