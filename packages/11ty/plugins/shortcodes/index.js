const backmatter = require('./backmatter.11ty.js')
const cite = require('./cite.11ty.js')
const contributor = require('./contributor.11ty.js')
const figure = require('./figure/index.11ty.js')
const figureGroup = require('./figureGroup.11ty.js')

const fs   = require('fs')
// const path = require('path')
const yaml = require('js-yaml')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPairedShortcode('backmatter', (data) => backmatter(data))

  const { entries } = yaml.load(fs.readFileSync('./src/_data/references.yaml'))
  const references = Object.fromEntries(
    entries.map(({ id, full }) => [id, full])
  )
  eleventyConfig.addShortcode('cite', (data) => cite(eleventyConfig, references, data))

  const publication = yaml.load(fs.readFileSync('./src/_data/publication.yaml'))
  eleventyConfig.addShortcode('contributor', (data) => {
    return contributor(eleventyConfig, publication, data)
  })

  const { figure_list } = yaml.load(fs.readFileSync('./src/_data/figures.yaml'))
  const figures = Object.fromEntries(figure_list.map((figure) => {
    const { caption, credit, id, src } = figure
    return [ id, { caption, credit, src }]
  }))
  eleventyConfig.addShortcode('figure', (data) => figure(eleventyConfig, figures, data))
  eleventyConfig.addShortcode('figuregroup', (data) => figureGroup(eleventyConfig, figures, data))
}
