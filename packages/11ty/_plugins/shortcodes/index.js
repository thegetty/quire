const addComponentTag = require('../../_plugins/components/addComponentTag')
const backmatter = require('./backmatter.js')
const bibliography = require('./bibliography.js')
const cite = require('./cite.js')
const contributors = require('./contributors')
const figure = require('./figure.js')
const figureGroup = require('./figureGroup.js')
const ref = require('./figureRef.js')
const title = require('./title.js')
const tombstone = require('./tombstone.js')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', function(content, ...args) {
    return backmatter(eleventyConfig)(content, ...args)
  })

  eleventyConfig.addShortcode('bibliography', function(...args) {
    return bibliography(eleventyConfig, { page: this.page })(...args)
  })
  
  eleventyConfig.addShortcode('cite', function(...args) {
    return cite(eleventyConfig, { page: this.page })(...args)
  })

  addComponentTag(eleventyConfig, contributors, 'contributors')

  eleventyConfig.addShortcode('figure', function(...args) {
    return figure(eleventyConfig, { page: this.page })(...args)
  })

  eleventyConfig.addShortcode('figuregroup', function(...args) {
    return figureGroup(eleventyConfig, { page: this.page })(...args)
  })

  eleventyConfig.addShortcode('ref', function(...args) {
    return ref(eleventyConfig)(...args)
  })

  eleventyConfig.addShortcode('title', function(...args) {
    return title(eleventyConfig, title)(...args)
  })

  eleventyConfig.addShortcode('tombstone', function(...args) {
    return tombstone(eleventyConfig, { page: this.page })(...args)
  })
}
