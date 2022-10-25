const path = require('path')
/**
 * Check if a figure is an image service
 * @param  {Object} figure
 * @return {Boolean}
 */
module.exports = function(figure) {
  const { src='' } = figure
  return path.parse(src) === 'info.json'
}
