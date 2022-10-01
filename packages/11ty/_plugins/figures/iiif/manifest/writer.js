const fs = require('fs-extra')
const path = require('path')

module.exports = class ManifestWriter {
  constructor(iiifConfig) {
    this.iiifConfig = iiifConfig
  }

  /**
   * Write manifest to file system and global data
   * 
   * @param  {Object} manifest JSON manifest
   */
  write(manifest) {
    if (!manifest) return
    const { outputRoot } = this.iiifConfig.dirs
    const pathName = manifest.id.split(this.iiifConfig.baseURL)[1]
    const outputPath = path.join(outputRoot, pathName)
    try {
      fs.ensureDirSync(path.parse(outputPath).dir)
      fs.writeJsonSync(outputPath, manifest)
      return { messages: [`Generated manifest`] }
    } catch(error) {
      return { errors: [`Failed to write manifest. ${error}`] }
    }
  }
}
