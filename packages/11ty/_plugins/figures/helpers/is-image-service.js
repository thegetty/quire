const path = require('path')
/**
 * Check if a figure is an image service
 * @param  {Object} figure
 * @return {Boolean}
 */
module.exports = function(figure) {
  const { src='', zoom } = figure
  const { base } = path.parse(src)
  return base === 'info.json' || zoom
}
