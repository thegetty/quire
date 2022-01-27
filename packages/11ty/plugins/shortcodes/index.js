const globalData = require('../globalData')

const backmatter = require('./backmatter')
const cite = require('./cite')
const contributor = require('./contributor')
const div = require('./div')
const figure = require('./figure')
const figureComponents = require('../../_includes/components/figure/')
const figureGroup = require('./figureGroup')
const icon = require('./icon')
const ref = require('./figureRef')
const title = require('./title')
const tombstone = require('./tombstone')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', function(content, ...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return backmatter(context, content, ...args)
  })

  eleventyConfig.addPairedShortcode('class', function(content, ...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return div(context, content, ...args)
  })

  eleventyConfig.addShortcode('cite', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return cite(context, ...args)
  })

  eleventyConfig.addShortcode('contributor', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return contributor(context, ...args)
  })

  eleventyConfig.addShortcode('icon', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return icon(context, ...args)
  })

  eleventyConfig.addShortcode('figure', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return figure(context, ...args)
  })

  eleventyConfig.addShortcode('figuregroup', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return figureGroup(context, ...args)
  })

  eleventyConfig.addShortcode('ref', function(ids) {
    const context = { eleventyConfig, globalData, page: this.page }
    return ref(context, ids)
  })

  eleventyConfig.addShortcode('title', function() {
    const context = { eleventyConfig, globalData, page: this.page }
    return title(context)
  })

  eleventyConfig.addShortcode('tombstone', function(...args) {
    const context = { eleventyConfig, globalData, page: this.page }
    return tombstone(context, ...args)
  })

  /**
   * Figure subcomponents
   */
  eleventyConfig.namespace('qfigure', () => {
    Object.keys(figureComponents).forEach((name) => 
      eleventyConfig.addShortcode(name, function(...args) {
        const context = { eleventyConfig, globalData, page: this.page }
        return figureComponents[name](context, ...args)
      })
    )
  })
}
