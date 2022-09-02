const path = require('path')
/**
 * Check if a figure is an image service
 * @param  {Object} figure
 * @return {Boolean}
 */
module.exports = function(figure) {
  const { iiifContent, manifestId, media_type: mediaType, src='' } = figure
  const { base } = path.parse(src)
  return base === 'info.json' || (mediaType === 'iiif' && !iiifContent && !manifestId)
}
