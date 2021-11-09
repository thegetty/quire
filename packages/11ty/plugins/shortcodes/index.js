const backmatter = require('./backmatter.11ty.js')
const cite = require('./cite.11ty.js')
const contributor = require('./contributor.11ty.js')
const figure = require('./figure/index.11ty.js')
const figureGroup = require('./figureGroup.11ty.js')
const globalData = require('../globalData')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', (data) => backmatter(data, globalData))
  eleventyConfig.addShortcode('cite', (data) => cite(eleventyConfig, globalData, data))
  eleventyConfig.addShortcode('contributor', (data) =>
    contributor(eleventyConfig, globalData, data)
  )
  eleventyConfig.addShortcode('figure', (data) => figure(eleventyConfig, globalData, data))
  eleventyConfig.addShortcode('figuregroup', (columns, ids) =>
    figureGroup(eleventyConfig, globalData, columns, ids)
  )
}
