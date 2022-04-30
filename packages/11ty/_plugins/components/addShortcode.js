/**
 * Adds a custom tag for a shortcode component.
 *
 * Shortcodes are added for all template languages. This is a simple wrapper
 * around `eleventyConfig.addShortcode()`, providing `page` data to component.
 * @see ./addComponentTag.js to add custom tags with keyword arguments.
 *
 * @param  {Object}  eleventyConfig  The Eleventy configuration instance
 * @param  {Object}  component       A JavaScript shortcode component
 * @param  {String}  tagName         A template tag name for the component
 */
module.exports = function(eleventyConfig, component, tagName) {
  eleventyConfig.addShortcode(tagName, function(...args) {
    return component(eleventyConfig, { page: this.page })(...args)
  })
}
