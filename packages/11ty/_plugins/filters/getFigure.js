/**
 * Looks up a figure in figures.yaml by id
 * @param  {Object} eleventyConfig
 * @param  {String} id             figure id
 * @return {Object}                figure
 */
module.exports = function(eleventyConfig, id) {
  const { figure_list } = eleventyConfig.globalData.figures
  const figure = figure_list.find((item) => item.id === id)
  if (!figure) {
    console.warn(`Error: the id '${id}' was not found in 'figures.yaml'`)
    return ''
  }
  return figure
}
