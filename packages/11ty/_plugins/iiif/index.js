const fs = require('fs-extra')
const path = require('path')
const { build: biiif } = require('biiif');

module.exports = function(eleventyConfig, options) {
  eleventyConfig.on('beforeBuild', () => {
    console.warn(`[eleventy:beforeBuild:iiif] Checking for new images...`)
    const iiifDirectory = path.join('content', '_assets', 'images', 'iiif')
    const filenames = fs.readdirSync(iiifDirectory)
    filenames.forEach(filename => {
      const filePath = path.join(iiifDirectory, filename)
      if (fs.lstatSync(filePath).isDirectory()) {
        const manifest = path.join(filePath, 'index.json')
        if (!fs.pathExistsSync(manifest)) {
          console.warn(`[eleventy:beforeBuild:iiif] Processing "${filename}"`)
          biiif(filePath, path.join('http://localhost:3000', 'images', 'iiif'))  
        } else {
          console.warn(`[eleventy:beforeBuild:iiif] Image "${filename}" has already been processed, skipping.`)
        }
      }
    })
    console.warn('[eleventy:beforeBuild:iiif] Done')
  })
  // eleventyConfig.on('afterBuild', () => {})
}
