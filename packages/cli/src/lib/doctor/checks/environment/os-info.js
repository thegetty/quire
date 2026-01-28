/**
 * Operating system info check
 *
 * @module lib/doctor/checks/environment/os-info
 */
import os from 'node:os'
import { getPlatformName, getPlatform, Platform } from '#lib/platform.js'
import createDebug from '#debug'

const debug = createDebug('lib:doctor:os-info')

/**
 * Report operating system information
 *
 * This is an informational check that always passes.
 * It provides context for other checks and helps with troubleshooting.
 *
 * @returns {import('../../index.js').CheckResult}
 */
export function checkOsInfo() {
  const platform = getPlatform()
  const platformName = getPlatformName()

  const arch = os.arch()
  const cpuCount = os.cpus().length
  const totalMem = os.totalmem()

  debug('Platform: %s, Name: %s, Arch: %s', platform, platformName, arch)

  // Build informational message
  let message = `${platformName} (${arch})`

  // Add platform-specific notes
  if (platform === Platform.WINDOWS) {
    message += ' - Git for Windows recommended'
  }

  const memGB = (totalMem / 1024 / 1024 / 1024).toFixed(1)
  const details = `Memory: ${memGB} GB, CPUs: ${cpuCount}`

  return {
    ok: true,
    message,
    details,
  }
}

export default checkOsInfo
