import fs from 'fs-extra'
import path from 'node:path'

export default class ManifestWriter {
  constructor (iiifConfig) {
    this.baseURI = iiifConfig.baseURI
    this.outputRoot = iiifConfig.dirs.outputRoot
  }

  /**
   * Write an IIIF manifest to the file system
   *
   * @param  {Object} manifest  IIIF manifest
   */
  write (manifest) {
    if (!manifest) return { errors: ['Error writing manifest. Manifest is undefined.'] }
    if (typeof manifest.id !== 'string') return { errors: ['Error writing manifest. Manifest id is invalid.'] }
    const uriPathname = manifest.id.replace(this.baseURI, '')
    const outputRootPath = path.resolve(this.outputRoot)
    const outputPath = path.resolve(this.outputRoot, uriPathname)
    if (outputPath !== outputRootPath && !outputPath.startsWith(`${outputRootPath}${path.sep}`)) {
      return { errors: ['Failed to write manifest. Manifest id resolves outside output directory.'] }
    }
    try {
      fs.ensureDirSync(path.parse(outputPath).dir)
      fs.writeJsonSync(outputPath, manifest, { spaces: 2 })
      return { messages: [`Generated manifest ${outputPath}`] }
    } catch (error) {
      return { errors: [`Failed to write manifest. ${error}`] }
    }
  }
}
