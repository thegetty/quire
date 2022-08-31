const chalkFactory = require('~lib/chalk')
const Figure = require('./figure')
const iiifConfig = require('./iiif/config')
const { error } = chalkFactory('Figure Processing')

module.exports = function (eleventyConfig, options = {}) {
  iiifConfig(eleventyConfig)

  eleventyConfig.on('eleventy.before', async () => {
    let { figure_list: figureList } = eleventyConfig.globalData.figures
    figureList = await Promise.all(
      figureList.map((data) => {
        const figure = new Figure(eleventyConfig, data)
        return figure.create()
      })
    )
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

    Object.assign(eleventyConfig.globalData.figures.figure_list, figureList.map((figure) => figure.adapter()))
  })
}
