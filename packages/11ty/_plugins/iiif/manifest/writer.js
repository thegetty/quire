const fs = require('fs-extra')
const path = require('path')
const Manifest = require('./index')

module.exports = class ManifestWriter {
  constructor(eleventyConfig) {
   this.iiifConfig = eleventyConfig.globalData.iiifConfig
  }

  addToGlobalData(eleventyConfig) {
    eleventyConfig.addGlobalData('iiifManifests', {
      ...eleventyConfig.globalData.iiifManifests,
      [this.figure.id]: this.manifestJSON
    })
  }

  async createManifest(figure) {
    this.figure = figure
    const manifest = new Manifest(this.iiifConfig, figure)
    this.manifestJSON = await manifest.toJSON()
    return this
  }

  write() {
    const { manifestFilename, outputDir, outputRoot } = this.iiifConfig
    const outputPath = path.join(outputRoot, outputDir, this.figure.id, manifestFilename)
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeJsonSync(outputPath, this.manifestJSON)
  }
}
