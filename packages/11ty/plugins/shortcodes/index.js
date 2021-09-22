const bibliography = require ('./bibliography.11ty.js')
const cite = require ('./cite.11ty.js')
const contributor = require ('./contributor.11ty.js')
const figure = require ('./figure.11ty.js')
const figureGroup = require ('./figureGroup.11ty.js')
const figureZoom = require ('./figureZoom.11ty.js')
const styleClass = require ('./styleClass.11ty.js')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('class', styleClass)
  eleventyConfig.addShortcode('figure', figure)
}
