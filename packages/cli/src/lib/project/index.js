/**
 * Project module
 *
 * Provides project-level concerns including paths, detection, configuration,
 * and version management.
 */
import paths, { Paths } from './paths.js'
import detect from './detect.js'
import { loadProjectConfig } from './config.js'
import {
  getVersion,
  setVersion,
  getVersionsFromStarter,
  readVersionFile,
  writeVersionFile,
} from './version.js'

export {
  detect,
  loadProjectConfig,
  paths as default,
  Paths,
  getVersion,
  setVersion,
  getVersionsFromStarter,
  readVersionFile,
  writeVersionFile,
}
