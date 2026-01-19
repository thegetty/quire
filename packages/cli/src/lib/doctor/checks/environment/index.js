/**
 * Environment checks
 *
 * System prerequisites that must exist for Quire to function.
 *
 * @module lib/doctor/checks/environment
 */
export { checkNodeVersion } from './node-version.js'
export { checkNpmAvailable } from './npm-available.js'
export { checkGitAvailable } from './git-available.js'
