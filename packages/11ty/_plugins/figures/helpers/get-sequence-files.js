const fs = require('fs')
const path = require('path')
const isSequence = require('./is-sequence.js')

/**
 * Figure `getSequenceFiles` helper
 *
 *
 * @param  {Object} figure     Figure data
 * @param  {Object} iiifConfig IIIF Config data
 * @return {Array<string>}     An array of filenames
 */
module.exports = (figure, iiifConfig) => {
  if (!isSequence(figure)) return

  const { sequence } = figure
  const { dirs } = iiifConfig
  const { imagesDir, inputRoot } = dirs
  const sequenceDir = path.join(inputRoot, imagesDir, sequence[0].id)
  return fs.readdirSync(sequenceDir)
}
