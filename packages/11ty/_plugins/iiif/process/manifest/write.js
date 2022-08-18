const fs = require('fs-extra')
const Manifest = require('./manifest')

module.exports = function(eleventyConfig) {
  const { manifestFilename, outputDir, outputRoot } = eleventyConfig.globalData.iiifConfig
  return function(figure) {
    const manifest = new Manifest({ eleventyConfig, figure })
    const manifestOutput = path.join(outputRoot, outputDir, id, manifestFilename)

    fs.ensureDirSync(path.parse(manifestOutput).dir)
    fs.writeJsonSync(manifestOutput, manifest)

    eleventyConfig.addGlobalData('iiifManifests', {
      ...eleventyConfig.globalData.iiifManifests,
      [id]: manifest
    })
  }
}
