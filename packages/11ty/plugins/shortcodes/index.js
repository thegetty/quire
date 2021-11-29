const globalData = require('../globalData')

const backmatter = require('./backmatter.11ty.js')
const cite = require('./cite.11ty.js')
const contributor = require('./contributor.11ty.js')
const div = require('./div.11ty.js')
const figure = require('./figure/index.11ty.js')
const figureComponents = require('./figure/components')
const figureGroup = require('./figureGroup.11ty.js')
const icon = require('./icon.11ty.js')
const ref = require('./figureRef.11ty.js')
const title = require('./title.11ty.js')
const tombstone = require('./tombstone.11ty.js')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', (content) => backmatter(content))

  eleventyConfig.addPairedShortcode('class', (content, classes) => div(eleventyConfig, content, classes))

  eleventyConfig.addShortcode('cite', function (data) {
    return cite(eleventyConfig, globalData, this.page, data)
  })

  eleventyConfig.addShortcode('contributor', (...args) =>
    contributor(eleventyConfig, globalData, ...args)
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

  eleventyConfig.addShortcode('tombstone', (pageObjects) =>
    tombstone(eleventyConfig, globalData, pageObjects)
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
