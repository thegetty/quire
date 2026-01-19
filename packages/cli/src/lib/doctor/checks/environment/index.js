/**
 * Environment checks
 *
 * System prerequisites that must exist for Quire to function.
 *
 * @module lib/doctor/checks/environment
 */
export { checkOsInfo } from './os-info.js'
export { checkCliVersion } from './cli-version.js'
export { checkNodeVersion } from './node-version.js'
export { checkNpmAvailable } from './npm-available.js'
export { checkGitAvailable } from './git-available.js'
export { checkPrinceAvailable } from './prince-available.js'
