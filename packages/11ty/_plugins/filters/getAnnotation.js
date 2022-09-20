/**
 * Looks up an annotation object in figures.yaml by id
 * @param  {Object} eleventyConfig
 * @param  {String} id             annotation id
 * @return {Object}                annotation
 */
module.exports = function(eleventyConfig, fig, annotationId) {
  const getFigure = eleventyConfig.getFilter('getFigure')
  const { figure_list: figureList } = eleventyConfig.globalData.figures
  const figure = getFigure(fig)
  if (!figure || !Array.isArray(figure.annotations)) return
  return figure.annotations
    .flatMap(({ items }) => items)
    .find(({ id }) =>  id === annotationId)
}
