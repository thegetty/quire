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
    const uriPathname = manifest.id.replace(this.baseURI, '')
    const outputPath = path.join(this.outputRoot, uriPathname)
    try {
      fs.ensureDirSync(path.parse(outputPath).dir)
      fs.writeJsonSync(outputPath, manifest, { spaces: 2 })
      return { messages: [`Generated manifest ${outputPath}`] }
    } catch(error) {
      return { errors: [`Failed to write manifest. ${error}`] }
    }
  }
}
