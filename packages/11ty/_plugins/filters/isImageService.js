/**
 * Check if a figure is an image service
 * @param  {Object} figure
 * @return {Boolean}
 */
module.exports = function(figure) {
  const { iiifContent, manifestId, media_type: mediaType, preset } = figure
  return mediaType === 'imageservice' || (preset === 'zoom' && !iiifContent && !manifestId)
}
