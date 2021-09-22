const bibliography = require ('./bibliography.11ty.js')
const cite = require ('./cite.11ty.js')
const contributor = require ('./contributor.11ty.js')
const figure = require ('./figure.11ty.js')
const figureGroup = require ('./figureGroup.11ty.js')
const figureZoom = require ('./figureZoom.11ty.js')
const styleClass = require ('./styleClass.11ty.js')

module.exports = function(eleventyConfig, options) {
  const config = eleventyConfig
  eleventyConfig.addPairedShortcode('qclass', styleClass)
  eleventyConfig.addShortcode('qbibliography', (data) => bibliography(config, data))
  eleventyConfig.addShortcode('qcite', (data) => cite(config, data))
  eleventyConfig.addShortcode('qcontributor', (data) => contributor(config, data))
  eleventyConfig.addShortcode('qfigure', (data) => figure(config, data))
  eleventyConfig.addShortcode('qfigureGroup', (data) => figureGroup(config, data))
  eleventyConfig.addShortcode('qfigureZoom', (data) => figureZoom(config, data))
}
