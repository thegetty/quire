const globalData = require('../globalData')
const liquidArgs = require('liquid-args')
// const { Liquid, Hash } = require('liquidjs')
const components = require('../../_includes/components')

/**
 * Define components as universal template shortcodes
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options         options
 */
module.exports = function(eleventyConfig, options) {
  for (const component in components) {
    eleventyConfig.addJavaScriptFunction(component, function(...args) {
      return components[component](eleventyConfig, ...args)
    })

    const renderComponent = function(...args) {
      const kwargs = args.find((arg) => arg.__keywords)
      return components[component](eleventyConfig, kwargs)
    }

    eleventyConfig.addLiquidTag(component, function(liquidEngine) {
      return {
        parse: function(tagToken) {
          this.args = tagToken.args //new Hash(tagToken.args)
        },
        render: async function(scope) {
          const evalValue = (arg) => liquidEngine.evalValue(arg, scope)
          const args = await Promise.all(liquidArgs(this.args, evalValue))
          return renderComponent(...args)
        }
        // * render(context, emitter) {
        //   const args = yield this.args.render(context)
        //   emitter.write(component[component](eleventyConfig, ...args))
        // }
      }
    })
  }
}
