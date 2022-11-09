const fs = require('fs-extra')
const path = require('path')

module.exports = class ManifestWriter {
  constructor(iiifConfig) {
    this.baseURI = iiifConfig.baseURI
    this.outputRoot = iiifConfig.dirs.outputRoot
  }

  /**
   * Write an IIIF manifest to the file system
   *
   * @param  {Object} manifest  IIIF manifest
   */
  write(manifest) {
    if (!manifest) return { errors: ['Error writing manifest. Manifest is undefined.'] }
    const uri = new URL(manifest.id)
    const outputPath = path.join(this.outputRoot, uri.pathname)
    try {
      fs.ensureDirSync(path.parse(outputPath).dir)
      fs.writeJsonSync(outputPath, manifest)
      return { messages: [`Generated manifest ${outputPath}`] }
    } catch(error) {
      return { errors: [`Failed to write manifest. ${error}`] }
    }
  }
}
