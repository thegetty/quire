const fs = require('fs')
const path = require('path')

/**
 * Figure `getSequenceFiles` helper
 *
 *
 * @param  {Object} figure     Figure data
 * @param  {Object} iiifConfig IIIF Config data
 * @return {Array<string>}     An array of filenames
 */
module.exports = (sequence, iiifConfig) => {
  if (!sequence) return
  const { dirs } = iiifConfig
  const { imagesDir, inputRoot } = dirs
  const sequenceDir = path.join(inputRoot, imagesDir, sequence.id)
  const defaultSequenceRegex = /^\d{3}\.(jpg|png)$/
  const sequenceRegex = sequence.regex
    ? new RegExp(sequence.regex.slice(1, -1))
    : defaultSequenceRegex
  return fs
    .readdirSync(sequenceDir)
    .filter((sequenceItemFilename) => sequenceItemFilename.match(sequenceRegex))
}
