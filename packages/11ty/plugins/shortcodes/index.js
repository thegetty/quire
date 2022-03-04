const globalData = require('../globalData')
const liquidTag = require('../../plugins/components/liquidTag')

const backmatter = require('./backmatter.js')
const cite = require('./cite.js')
const contributor = require('./contributor')
const div = require('./div.js')
const figure = require('./figure/index.js')
const figureComponents = require('./figure/components')
const figureGroup = require('./figureGroup.js')
const ref = require('./figureRef.js')
const title = require('./title.js')
const tombstone = require('./tombstone.js')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', function(content, ...args) {
    const context = { eleventyConfig, globalData }
    return backmatter(context, content, ...args)
  })

  eleventyConfig.addPairedShortcode('class', function(content, ...args) {
    const context = { eleventyConfig, globalData }
    return div(context, content, ...args)
  })

  const context = { eleventyConfig, globalData, page: this.page }
  eleventyConfig.addJavaScriptFunction('cite', function(...args) {
    return cite(eleventyConfig, globalData)(...args)
  })
  liquidTag(eleventyConfig, cite, 'cite')

  eleventyConfig.addJavaScriptFunction('contributor', function(...args) {
    return cite(eleventyConfig, globalData)(...args)
  })
  liquidTag(eleventyConfig, contributor, 'contributor')

  eleventyConfig.addJavaScriptFunction('figure', function(...args) {
    return cite(eleventyConfig, globalData)(...args)
  })
  liquidTag(eleventyConfig, figure, 'figure')

  eleventyConfig.addJavaScriptFunction('figuregroup', function(...args) {
    return cite(eleventyConfig, globalData)(...args)
  })
  liquidTag(eleventyConfig, figureGroup, 'figuregroup')

  eleventyConfig.addJavaScriptFunction('ref', function(...args) {
    return cite(eleventyConfig, globalData)(...args)
  })
  liquidTag(eleventyConfig, ref, 'ref')

  eleventyConfig.addJavaScriptFunction('title', function(...args) {
    return cite(eleventyConfig, title)(...args)
  })
  liquidTag(eleventyConfig, title, 'figuregroup')

  eleventyConfig.addJavaScriptFunction('tombstone', function(...args) {
    return cite(eleventyConfig, globalData)(...args)
  })
  liquidTag(eleventyConfig, tombstone, 'tombstone')

  /**
   * Figure subcomponents
   */
  eleventyConfig.namespace('qfigure', () => {
    Object.keys(figureComponents).forEach((name) => {
      // eleventyConfig.addShortcode(name, function(...args) {
      //   const context = { eleventyConfig, globalData }
      //   return figureComponents[name](context, ...args)
      // })
      eleventyConfig.addJavaScriptFunction(name, function(...args) {
        return figureComponents[name](eleventyConfig, globalData)(...args)
      })
      liquidTag(eleventyConfig, figureComponents[name], name)
    })
  })
}
