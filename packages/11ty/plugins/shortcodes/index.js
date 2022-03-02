const globalData = require('../globalData')

const backmatter = require('./backmatter.js')
const cite = require('./cite.js')
const contributor = require('./contributor')
const div = require('./div.js')
const figure = require('./figure/index.js')
const figureComponents = require('./figure/components')
const figureGroup = require('./figureGroup.js')
const icon = require('./icon.js')
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

  /**
   * @todo remove this.page from context
   */
  eleventyConfig.addShortcode('cite', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return cite(context, ...args)
  })

  eleventyConfig.addShortcode('contributor', function(...args) {
    const context = { eleventyConfig, globalData }
    return contributor(context, ...args)
  })

  eleventyConfig.addShortcode('icon', function(...args) {
    const context = { eleventyConfig, globalData }
    return icon(context, ...args)
  })

  eleventyConfig.addShortcode('figure', function(...args) {
    const context = { eleventyConfig, globalData }
    return figure(context, ...args)
  })

  eleventyConfig.addShortcode('figuregroup', function(...args) {
    const context = { eleventyConfig, globalData }
    return figureGroup(context, ...args)
  })

  eleventyConfig.addShortcode('ref', function(ids) {
    const context = { eleventyConfig, globalData }
    return ref(context, ids)
  })

  eleventyConfig.addShortcode('title', function() {
    const context = { eleventyConfig, globalData }
    return title(context)
  })

  eleventyConfig.addShortcode('tombstone', function(...args) {
    const context = { eleventyConfig, globalData }
    return tombstone(context, ...args)
  })

  /**
   * Figure subcomponents
   */
  eleventyConfig.namespace('qfigure', () => {
    Object.keys(figureComponents).forEach((name) => 
      eleventyConfig.addShortcode(name, function(...args) {
        const context = { eleventyConfig, globalData }
        return figureComponents[name](context, ...args)
      })
    )
  })
}
