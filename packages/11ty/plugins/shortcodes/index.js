const backmatter = require('./backmatter.11ty.js')
const cite = require('./cite.11ty.js')
const contributor = require('./contributor.11ty.js')
const icon = require('./icon.11ty.js')
const figure = require('./figure/index.11ty.js')
const figureGroup = require('./figureGroup.11ty.js')
const figureComponents = require('./figure/components');
const globalData = require('../globalData')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', (data) => backmatter(data, globalData))
  eleventyConfig.addShortcode('cite', (data) => cite(eleventyConfig, globalData, data))
  eleventyConfig.addShortcode('contributor', (data) =>
    contributor(eleventyConfig, globalData, data)
  )
  eleventyConfig.addShortcode('icon', (name, description) => 
    icon(eleventyConfig, globalData, name, description)
  )
  eleventyConfig.addShortcode("figure", (id, classes) =>
    figure(eleventyConfig, globalData, id, classes)
  )
  eleventyConfig.addShortcode('figuregroup', (columns, ids) =>
    figureGroup(eleventyConfig, globalData, columns, ids)
  )
  /**
   * Figure subcomponents
   */
  eleventyConfig.namespace('qfigure', () => {
    Object.keys(figureComponents).forEach((name) => 
      eleventyConfig.addShortcode(name, (...args) => figureComponents[name](eleventyConfig, globalData, ...args))
    )
  })
}
