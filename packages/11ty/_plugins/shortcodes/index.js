const addComponentTag = require('../../_plugins/components/addComponentTag')
const backmatter = require('./backmatter.js')
const bibliography = require('./bibliography.js')
const canvasPanel = require('./canvasPanel.js')
const cite = require('./cite.js')
const contributor = require('./contributor')
const div = require('./div.js')
const figure = require('./figure.js')
const figureGroup = require('./figureGroup.js')
const ref = require('./figureRef.js')
const title = require('./title.js')
const tombstone = require('./tombstone.js')

const globalData = require('../globalData')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', function(content, ...args) {
    return backmatter(eleventyConfig, globalData)(content, ...args)
  })

  eleventyConfig.addShortcode('bibliography', function() {
    return bibliography(eleventyConfig, globalData, { page: this.page })()
  })

  addComponentTag(eleventyConfig, canvasPanel, 'canvasPanel')

  eleventyConfig.addPairedShortcode('class', function(content, ...args) {
    return div(eleventyConfig, globalData)(content, ...args)
  })
  
  eleventyConfig.addShortcode('cite', function(...args) {
    return cite(eleventyConfig, globalData, { page: this.page })(...args)
  })

  addComponentTag(eleventyConfig, contributor, 'contributor')

  eleventyConfig.addShortcode('figure', function(...args) {
    return figure(eleventyConfig, globalData, { page: this.page })(...args)
  })

  eleventyConfig.addShortcode('figuregroup', function(...args) {
    return figureGroup(eleventyConfig, globalData, { page: this.page })(...args)
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
