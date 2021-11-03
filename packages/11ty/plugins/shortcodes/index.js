const backmatter = require ('./backmatter.11ty.js')
const cite = require ('./cite.11ty.js')
const contributor = require ('./contributor.11ty.js')
const figure = require ('./figure.11ty.js')
const figureGroup = require ('./figureGroup.11ty.js')

module.exports = function(eleventyConfig, options) {
  const config = eleventyConfig

  eleventyConfig.addPairedShortcode('backmatter', (data) => backmatter(data))
  eleventyConfig.addShortcode('cite', (data) => cite(config, data))
  eleventyConfig.addShortcode('contributor', (data) => contributor(config, data))
  eleventyConfig.addShortcode('figure', (data) => figure(config, data))
  eleventyConfig.addShortcode('figuregroup', (data) => figureGroup(config, data))
}
