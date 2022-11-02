const path = require('path')

/**
 * Figure `isCanvas` helper
 * A figure is a canvas if it has a src and has zoom=true, has annotations,
 * or links to an external IIIF manifest
 * 
 * @param  {Object} data Figure data
 * @return {Boolean}     True if figure contains a canvas
 */
module.exports = (data) => {
  const { 
    annotations,
    canvasId,
    iiifContent,
    manifestId,
    src,
    zoom
  } = data
  return (!!canvasId && !!manifestId)
    || !!iiifContent
    || !!annotations
    || (!!src && !!zoom)
}
