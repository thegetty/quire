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

  liquidTag(eleventyConfig, cite, 'cite')
  liquidTag(eleventyConfig, contributor, 'contributor')
  liquidTag(eleventyConfig, figure, 'figure')
  liquidTag(eleventyConfig, figureGroup, 'figuregroup')

  eleventyConfig.addShortcode('ref', function(...args) {
    return ref(eleventyConfig, globalData)(...args)
  })

  eleventyConfig.addShortcode('title', function(...args) {
    return title(eleventyConfig, title)(...args)
  })

  eleventyConfig.addShortcode('tombstone', function(...args) {
    return tombstone(eleventyConfig, globalData)(...args)
  })

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
