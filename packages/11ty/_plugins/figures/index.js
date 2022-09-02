const chalkFactory = require('~lib/chalk')
const FigureFactory = require('./figure-factory')
const iiifConfig = require('./iiif/config')
const { error, info } = chalkFactory('Figure Processing')

module.exports = function (eleventyConfig, options = {}) {
  iiifConfig(eleventyConfig)

  eleventyConfig.on('eleventy.before', async () => {
    const factory = new FigureFactory(eleventyConfig)
    let { figure_list: figureList } = eleventyConfig.globalData.figures
    figureList = await Promise.all(figureList.map((data) => {
      const figure = factory.create(data)
      return factory.process(figure)
    }))
    const figureErrors = figureList.filter(({ errors }) => !!errors.length)

    if (figureErrors.length) {
      error(`There were errors processing the following images:`)
      console.table(
        figureErrors.map((figure) => {
          return { ...figure, errors: figure.errors.join(' ')}
        }),
        ['id', 'errors']
      );
    }
    const figureData = figureList.map(({ data }) => data)
    Object.assign(eleventyConfig.globalData.figures.figure_list, figureData)

    info(`Done`)
  })
}
