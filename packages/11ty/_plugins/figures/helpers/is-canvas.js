/**
 * Test if a figure uses a canvas-panel
 *
 * @param  {Object} figure
 * @return {Boolean}
 */
module.exports = (figure) => {
  const { annotations, canvasId, id, iiifContent, manifestId } = figure
  return (!!canvasId && !!manifestId) || !!iiifContent || !!annotations
}
