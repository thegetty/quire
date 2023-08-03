const isSequence = require('./is-sequence.js')

/**
 * Figure `isCanvas` helper
 * A figure is a canvas if it has a src and has zoom=true, has annotations,
 * is a sequence, or links to an external IIIF manifest
 *
 * @param  {Object} figure Figure data
 * @return {Boolean}       True if figure contains a canvas
 */
module.exports = (figure) => {
  const {
    annotations,
    canvasId,
    iiifContent,
    manifestId,
    src,
    zoom
  } = figure
  // TODO refactor this to NOT need `isSequence` and `Figure:createManifest` to work with `isSequence`
  return (!!canvasId && !!manifestId)
    || isSequence(figure)
    || !!iiifContent
    || !!annotations
    || (!!src && !!zoom)
}
