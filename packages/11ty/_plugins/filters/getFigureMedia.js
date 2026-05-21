/* eslint-disable camelcase */

/**
 * Looks up a figure in figures.yaml by id
 * @param  {Object} eleventyConfig
 * @param  {String} id             figure id
 * @return {Object}                figure
 */
export default function (eleventyConfig, id) {
  const { figureMedia } = eleventyConfig.globalData
  return figureMedia.find((item) => item.id === id)
}
