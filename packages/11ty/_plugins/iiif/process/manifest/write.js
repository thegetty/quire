const fs = require('fs-extra')
const path = require('path')
const Manifest = require('./index')

module.exports = function(eleventyConfig) {
  const { manifestFilename, outputDir, outputRoot } = eleventyConfig.globalData.iiifConfig

  return async function(figure) {
    const outputPath = path.join(outputRoot, outputDir, figure.id, manifestFilename)

    const manifest = new Manifest({ eleventyConfig, figure })
    const manifestJSON = await manifest.json()

    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeJsonSync(outputPath, manifestJSON)

    eleventyConfig.addGlobalData('iiifManifests', {
      ...eleventyConfig.globalData.iiifManifests,
      [figure.id]: manifestJSON
    })
  }
}
