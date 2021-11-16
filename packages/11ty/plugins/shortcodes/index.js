const backmatter = require('./backmatter.11ty.js')
const cite = require('./cite.11ty.js')
const contributor = require('./contributor.11ty.js')
const figure = require('./figure/index.11ty.js')
const figureComponents = require('./figure/components')
const figureGroup = require('./figureGroup.11ty.js')
const globalData = require('../globalData')
const icon = require('./icon.11ty.js')
const ref = require('./figureRef.11ty.js')
const title = require('./title.11ty.js')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', (content) => backmatter(content))

  eleventyConfig.addShortcode('cite', (data) => cite(eleventyConfig, globalData, data))

  eleventyConfig.addShortcode('contributor', (data) =>
    contributor(eleventyConfig, globalData, data)
  )

  eleventyConfig.addShortcode('icon', (name, description) =>
    icon(eleventyConfig, globalData, name, description)
  )

  eleventyConfig.addShortcode('figure', (id, classes) =>
    figure(eleventyConfig, globalData, id, classes)
  )

  eleventyConfig.addShortcode('figuregroup', (columns, ids) =>
    figureGroup(eleventyConfig, globalData, columns, ids)
  )

  eleventyConfig.addShortcode('ref', (ids) => ref(ids))

  eleventyConfig.addShortcode('title', () => title(eleventyConfig, globalData))

  /**
   * Figure subcomponents
   */
  eleventyConfig.namespace('qfigure', () => {
    Object.keys(figureComponents).forEach((name) => 
      eleventyConfig.addShortcode(name, (...args) => figureComponents[name](eleventyConfig, globalData, ...args))
    )
  })
}
