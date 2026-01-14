/**
 * Project module
 *
 * Provides project-level concerns including paths, detection, and configuration.
 */
import paths, { Paths } from './paths.js'
import detect from './detect.js'
import { loadProjectConfig } from './config.js'

export { detect, loadProjectConfig, Paths, paths as default }
