/**
 * Looks up an annotation object in figures.yaml by id
 * @param  {Object} eleventyConfig
 * @param  {String} id             annotation id
 * @return {Object}                annotation
 */
export default function (eleventyConfig, fig, annotationId) {
  const getFigure = eleventyConfig.getFilter('getFigure')

  const figure = getFigure(fig)
  if (!figure || !Array.isArray(figure.annotations)) return
  return figure.annotations
    .flatMap(({ items }) => items)
    .find(({ id }) => id === annotationId)
}
