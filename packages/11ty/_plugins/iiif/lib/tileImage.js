const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

module.exports = function(input, output, options = {}) {
  const { debug, lazy } = options

  const { dir } = path.parse(input)
  const dirParts = dir.split(path.sep)
  const id = dirParts[dirParts.length - 1]

  const tileDirectory = path.join(output, 'tiles')

  if (fs.pathExistsSync(tileDirectory) && lazy) {
    return
  }

  fs.ensureDirSync(tileDirectory)

  const iiifId = path.join(
    process.env.URL,
    output.split(path.sep).slice(1).join(path.sep)
  )

  if (debug) {
    console.warn(`[iiif:lib:tileImage:${id}] Tiling image: `, { id: iiifId, input, output })
  }
  sharp(input)
    .tile({
      id: iiifId,
      layout: 'iiif',
      size: 512
    })
    .toFile(tileDirectory)
}
