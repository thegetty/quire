/**
 * Figure `isSequence` helper
 * A figure is a sequence if it has a sequence
 *
 * @param  {Object} figure Figure data
 * @return {Boolean}       True if figure contains a canvas
 */
export default (figure) => {
  const { sequences } = figure
  return !!sequences && !!sequences.length
}
