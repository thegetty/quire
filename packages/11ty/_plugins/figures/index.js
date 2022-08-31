const Figure = require('./figure')
const iiifConfig = require('./iiif/config')

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
    Object.assign(eleventyConfig.globalData.figures.figure_list, figureList)
  })
}
