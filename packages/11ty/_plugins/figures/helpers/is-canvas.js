import isSequence from './is-sequence.js'

/**
 * Figure `isCanvas` helper
 * A figure is a canvas if it has a src and has zoom=true, has annotations,
 * is a sequence, or links to an external IIIF manifest
 *
 * NB: `figure` is _figure data_ so props are snake-cased
 *
 * @param  {Object} figure Figure data
 * @return {Boolean}       True if figure contains a canvas
 */
export default (figure) => {
  const {
    annotations,
    canvasId,
    iiifContent,
    iiif_image: iiifImage,
    manifestId,
    src,
    zoom
  } = figure
  // TODO refactor this to NOT need `isSequence` and `Figure:createManifest` to work with `isSequence`
  return (!!canvasId && !!manifestId) ||
    isSequence(figure) ||
    !!iiifContent ||
    !!annotations ||
    (!!src && !!zoom) ||
    (!!iiifImage && !!zoom)
}
