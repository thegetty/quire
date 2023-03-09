const chalkFactory = require('~lib/chalk')
const FigureFactory = require('./figure/factory')
const iiifConfig = require('./iiif/config')

const logger = chalkFactory('Figures', 'DEBUG')

/**
 * Figures Plugin
 * Uses the FigureFactory to create Figure instances
 * for all figures in `figures.yaml` and updates global data
 */
module.exports = function (eleventyConfig, options = {}) {
  eleventyConfig.on('eleventy.before', async () => {
    const config = iiifConfig(eleventyConfig)
    const figureFactory = new FigureFactory(config)

    const { figure_list: figureList } = eleventyConfig.globalData.figures

    const figures = await Promise.all(
      figureList.map((data) => {
        return figureFactory.create(data)
      })
    )
    const errors = figureList.filter(({ errors }) => errors && !!errors.length)

    if (errors.length) {
      logger.error('There were errors processing the following images:')
      console.table(
        errors.map(({ errors, figure }) => {
          return { id: figure.id, errors: errors.join(' ') }
        }),
        ['id', 'errors']
      )
    }

    /**
     * Add IIIFConfig to global data
     */
    eleventyConfig.globalData.iiifConfig = config

    /**
     * Update global figures data to only have properties for Quire shortcodes
     */
    Object.assign(
      figureList,
      figures.map(({ figure }) => figure.adapter()),
    )
    logger.info('Processing complete')
  })
}
