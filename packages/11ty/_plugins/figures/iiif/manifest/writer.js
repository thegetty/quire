const fs = require('fs-extra')
const path = require('path')
const Manifest = require('./index')

module.exports = class ManifestWriter {
  constructor(iiifConfig) {
    this.iiifConfig = iiifConfig
  }

  /**
   * Write manifest to file system and global data
   * 
   * @param  {Object} figure   figure entry data
   * @param  {Object} manifest JSON manifest
   */
  write({ figure, manifest }) {
    const { outputRoot } = this.iiifConfig.dirs
    const { pathname } = new URL(manifest.id)
    const outputPath = path.join(outputRoot, pathname)
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeJsonSync(outputPath, manifest)
  }
}
