/**
 * Figure `isSequence` helper
 * A figure is a sequence if it has a sequence
 *
 * @param  {Object} figure Figure data
 * @return {Boolean}       True if figure contains a canvas
 */
module.exports = (figure) => {
  const { sequence } = figure
  return !!sequence
}
