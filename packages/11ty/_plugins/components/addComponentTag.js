const liquidArgs = require('liquid-args')
// const { Liquid, Hash } = require('liquidjs')

/**
 * Adds a custom tag to template languages for a shortcode component.
 *
 * Shortcodes are added for supported template languages individually,
 * rather than as [universal shortcodes](https://www.11ty.dev/docs/shortcodes/),
 * to allow a custom tag for Liquid templates that accepts keyword arguments.
 *
 * @param  {Object}  eleventyConfig  The Eleventy configuration instance
 * @param  {Object}  component       A JavaScript shortcode component
 * @param  {String}  tagName         A template tag name for the component
 */
module.exports = function(eleventyConfig, tagName, component) {
  /**
   * JavaScript template function
   * @see https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions
   * @see https://www.11ty.dev/docs/languages/javascript/#relationship-to-filters-and-shortcodes
   */
  if (component.constructor.name === 'AsyncFunction') {
    eleventyConfig.addJavaScriptFunction(tagName, async function(...args) {
      return await component(eleventyConfig)(...args)
    })
  } else {
    eleventyConfig.addJavaScriptFunction(tagName, function(...args) {
      return component(eleventyConfig)(...args)
    })
  }

  // Component function for a Liquid tag with keyword arguments
  const renderComponent = async function(...args) {
    const kwargs = args.find((arg) => arg.__keywords)
    return component(eleventyConfig)(kwargs)
  }

  /**
   * Liquid template custom tag with keyword args
   * @see https://www.11ty.dev/docs/custom-tags/
   */
  eleventyConfig.addLiquidTag(tagName, function(liquidEngine) {
    return {
      parse: function(tagToken) {
        this.args = tagToken.args //new Hash(tagToken.args)
      },
      render: async function(scope) {
        const evalValue = (arg) => liquidEngine.evalValue(arg, scope)
        const args = await Promise.all(liquidArgs(this.args, evalValue))
        return await renderComponent(...args)
      }
    }
  })

  /**
   * Nunjucks template tag
   * @see https://www.11ty.dev/docs/languages/nunjucks/#single-shortcode
   */
  eleventyConfig.addNunjucksShortcode(tagName, function(...args) {
    return component(eleventyConfig)(...args)
  })

  /**
   * Handlebars template tag
   * @see https://www.11ty.dev/docs/languages/handlebars/#single-shortcode
   */
  eleventyConfig.addHandlebarsShortcode(tagName, function(...args) {
    return component(eleventyConfig)(...args)
  })
}
