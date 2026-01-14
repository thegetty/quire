/**
 * Project module
 *
 * Provides project-level concerns including paths, detection, and configuration.
 */
import paths, { Paths } from './paths.js'
import detect from './detect.js'

export { detect, Paths, paths as default }
