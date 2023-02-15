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

  const { sequences } = figure
  const { dirs } = iiifConfig
  const { imagesDir, inputRoot } = dirs
  const sequenceDir = path.join(inputRoot, imagesDir, sequences[0].id)
  const defaultSequenceRegex = /^\d{3}\.(jpg|png)$/
  const sequenceRegex = sequences[0].regex
    ? new RegExp(sequences[0].regex.slice(1, -1))
    : defaultSequenceRegex
  return fs
    .readdirSync(sequenceDir)
    .filter((sequenceItemFilename) => sequenceItemFilename.match(sequenceRegex))
}
