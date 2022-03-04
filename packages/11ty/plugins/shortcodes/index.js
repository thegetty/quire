const addComponentTag = require('../../plugins/components/addComponentTag')
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

const globalData = require('../globalData')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', function(content, ...args) {
    const context = { eleventyConfig, globalData }
    return backmatter(context, content, ...args)
  })

  eleventyConfig.addPairedShortcode('class', function(content, ...args) {
    const context = { eleventyConfig, globalData }
    return div(context, content, ...args)
  })

  addComponentTag(eleventyConfig, cite, 'cite', { page: this.page })
  addComponentTag(eleventyConfig, contributor, 'contributor')
  addComponentTag(eleventyConfig, figure, 'figure')
  addComponentTag(eleventyConfig, figureGroup, 'figuregroup')

  /**
   * figure shortcode subcomponents
   */
  eleventyConfig.namespace('figure', () => {
    Object.keys(figureComponents).forEach((name) => {
      addComponentTag(eleventyConfig, figureComponents[name], name)
    })
  })

  eleventyConfig.addShortcode('ref', function(...args) {
    return ref(eleventyConfig, globalData)(...args)
  })

  eleventyConfig.addShortcode('title', function(...args) {
    return title(eleventyConfig, title)(...args)
  })

  eleventyConfig.addShortcode('tombstone', function(...args) {
    return tombstone(eleventyConfig, globalData)(...args)
  })
}
