const path = require('path')

/**
 * Test if a figure uses an image-service
 *
 * @param  {Object} figure
 * @return {Boolean}
 */
module.exports = function(figure) {
  const { src='', zoom } = figure
  const { base } = path.parse(src)
  return base === 'info.json' || zoom
}
