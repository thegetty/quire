const chalkFactory = require('~lib/chalk')
const FigureFactory = require('./figure/factory')
const iiifConfig = require('./iiif/config')
const { error, info } = chalkFactory('Figure Processing')

/**
 * Figures Plugin
 * Uses the FigureFactory to create Figure instances
 * for all figures in `figures.yaml` and updates global data
 */
module.exports = function (eleventyConfig, options = {}) {
  const config = iiifConfig(eleventyConfig)
  const figureFactory = new FigureFactory(config)

  eleventyConfig.on('eleventy.before', async () => {
    let { figure_list: figureList } = eleventyConfig.globalData.figures
    figureList = await Promise.all(figureList.map((data) => {
      return figureFactory.create(data)
    }))
    const errors = figureList.filter(({ errors }) => !!errors.length)

    if (errors.length) {
      error(`There were errors processing the following images:`)
      console.table(
        errors.map(({ errors, figure }) => {
          return { id: figure.id, errors: errors.join(' ')}
        }),
        ['id', 'errors']
      )
    }
    const figures = figureList.map(({ figure }) => figure.adapter())
    Object.assign(eleventyConfig.globalData.figures.figure_list, figures)

    info(`Done`)
  })
}
