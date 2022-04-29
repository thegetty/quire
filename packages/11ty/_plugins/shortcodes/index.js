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

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', function(content, ...args) {
    return backmatter(eleventyConfig)(content, ...args)
  })

  eleventyConfig.addShortcode('bibliography', function() {
    return bibliography(eleventyConfig, { page: this.page })()
  })

  addComponentTag(eleventyConfig, canvasPanel, 'canvasPanel')

  eleventyConfig.addPairedShortcode('class', function(content, ...args) {
    return div(eleventyConfig)(content, ...args)
  })
  
  eleventyConfig.addShortcode('cite', function(...args) {
    return cite(eleventyConfig, { page: this.page })(...args)
  })

  addComponentTag(eleventyConfig, contributor, 'contributor')
  addComponentTag(eleventyConfig, figure, 'figure')
  addComponentTag(eleventyConfig, figureGroup, 'figuregroup')

  eleventyConfig.addShortcode('ref', function(...args) {
    return ref(eleventyConfig)(...args)
  })

  eleventyConfig.addShortcode('title', function(...args) {
    return title(eleventyConfig, title)(...args)
  })

  eleventyConfig.addShortcode('tombstone', function(...args) {
    return tombstone(eleventyConfig)(...args)
  })
}
