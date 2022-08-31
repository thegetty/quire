const fs = require('fs-extra')
const path = require('path')
const Manifest = require('./index')

module.exports = class ManifestWriter {
  constructor(eleventyConfig) {
    this.iiifConfig = eleventyConfig.globalData.iiifConfig
  }

  /**
   * Write manifest to file system and global data
   * 
   * @param  {Object} figure   figure entry data
   * @param  {Object} manifest JSON manifest
   */
  write({ figure, manifest }) {
    const { manifestFilename, outputDir, outputRoot } = this.iiifConfig
    const outputPath = path.join(outputRoot, outputDir, figure.id, manifestFilename)
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeJsonSync(outputPath, manifest)
  }
}
