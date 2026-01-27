/**
 * Project module
 *
 * Provides project-level concerns including paths, detection, configuration,
 * build status, and version management.
 */
import paths, { DATA_DIR, Paths, REQUIRED_DATA_FILES, SOURCE_DIRECTORIES } from './paths.js'
import detect, { PROJECT_MARKERS } from './detect.js'
import { loadProjectConfig } from './config.js'
import {
  getBuildInfo,
  hasEpubOutput,
  hasPdfOutput,
  hasSiteOutput,
  requireBuildOutput,
} from './build.js'
import {
  getPdfOutputPaths,
  getEpubOutputPaths,
  getEpubBuildDir,
  PDF_ENGINES,
  EPUB_ENGINES,
} from './output-paths.js'
import {
  getVersion,
  setVersion,
  getVersionsFromStarter,
  readVersionFile,
  writeVersionFile,
} from './version.js'

export {
  DATA_DIR,
  EPUB_ENGINES,
  PDF_ENGINES,
  PROJECT_MARKERS,
  REQUIRED_DATA_FILES,
  SOURCE_DIRECTORIES,
  detect,
  getBuildInfo,
  getEpubBuildDir,
  getEpubOutputPaths,
  getPdfOutputPaths,
  hasEpubOutput,
  hasPdfOutput,
  hasSiteOutput,
  loadProjectConfig,
  paths as default,
  Paths,
  requireBuildOutput,
  getVersion,
  setVersion,
  getVersionsFromStarter,
  readVersionFile,
  writeVersionFile,
}
