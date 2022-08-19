const path = require('path')
const isImageService = require('./is-image-service')
/**
 * Return path to a figure entry's `info.json`
 * 
 * @param  {Object} iiifConfig
 * @param  {Object} figure
 * @return {String}            Path to figure's `info.json`
 */
module.exports = (eleventyConfig, figure) => {
  if (!isImageService(figure)) return

  const { imageServiceDirectory, outputDir } = eleventyConfig.globalData.iiifConfig
  const { src } = figure
  if (!src) return

  const { name } = path.parse(src)
  return src.startsWith('http')
    ? src
    : path.join('/', outputDir, name, imageServiceDirectory, 'info.json')
}
