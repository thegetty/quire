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
module.exports = function(eleventyConfig, collections) {
  return {
    addShortcode: function(tagName, component) {
      eleventyConfig.addShortcode(tagName, function(...args) {
        const page = collections.all.find(({ inputPath }) => inputPath === this.page.inputPath)
        return component(eleventyConfig, { collections, page }).bind(this)(...args)
      })
    },
    addPairedShortcode: function(tagName, component) {
      eleventyConfig.addPairedShortcode(tagName, function(content, ...args) {
        const page = collections.all.find(({ inputPath }) => inputPath === this.page.inputPath)
        return component(eleventyConfig, { collections, page })(content, ...args)
      })
    },
    /**
     * Adds a custom tag for a webc component.
     *
     * @param  {Array}  attributeNames    An array of attribute names to map to shortcode argument values
     * @param  {String}  tagName          A template tag name for the component
     * @param  {String}  webcElementName  A webc component tag name
     */
    addWebcShortcode: function(tagName, componentName, attributeNames=[]) {
      eleventyConfig.addShortcode(tagName, async function(...args) {
        const renderTemplate = eleventyConfig.getFilter('renderTemplate')
        const renderedAttributes = attributeNames.map((name, index) => `${name}="${args[index]}"`).join(' ')
        const template = `<${componentName} ${renderedAttributes}></${componentName}>`
        let renderedHTML
        try {
          renderedHTML = await renderTemplate.call(this, template, 'webc')
        } catch (error) {
          console.warn('ERROR', error)
        }
        return renderedHTML
      });
    }
  }
}
