const fs = require('fs-extra')
const path = require('path')
const Manifest = require('./index')

module.exports = class ManifestWriter {
  constructor(eleventyConfig) {
    this.eleventyConfig = eleventyConfig
    this.iiifConfig = eleventyConfig.globalData.iiifConfig
  }

  addToGlobalData({ figure, manifest }) {
    this.eleventyConfig.addGlobalData('iiifManifests', {
      ...this.eleventyConfig.globalData.iiifManifests,
      [figure.id]: manifest
    })
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

    this.addToGlobalData({ figure, manifest })
  }
}
