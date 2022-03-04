const globalData = require('../globalData')
const liquidArgs = require('liquid-args')
// const { Liquid, Hash } = require('liquidjs')

/**
 * Define components as universal template shortcodes
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options         options
 */
module.exports = function(eleventyConfig, component, tagName) {
  const renderComponent = function(...args) {
    const kwargs = args.find((arg) => arg.__keywords)
    return component(eleventyConfig, globalData)(kwargs)
  }

  eleventyConfig.addLiquidTag(tagName, function(liquidEngine) {
    return {
      parse: function(tagToken) {
        this.args = tagToken.args //new Hash(tagToken.args)
      },
      render: async function(scope) {
        const evalValue = (arg) => liquidEngine.evalValue(arg, scope)
        const args = await Promise.all(liquidArgs(this.args, evalValue))
        return renderComponent(...args)
      }
    }
  })
}
