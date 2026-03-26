/**
 * Platform detection utilities
 *
 * Provides OS detection and platform-specific helpers for the CLI.
 *
 * @module lib/platform
 */
import os from 'node:os'

/**
 * Platform identifiers
 * @readonly
 * @enum {string}
 */
export const Platform = {
  MACOS: 'macos',
  WINDOWS: 'windows',
  LINUX: 'linux',
  UNKNOWN: 'unknown',
}

/**
 * Get the current platform identifier
 * @returns {string} Platform identifier (macos, windows, linux, or unknown)
 */
export function getPlatform() {
  switch (process.platform) {
    case 'darwin':
      return Platform.MACOS
    case 'win32':
      return Platform.WINDOWS
    case 'linux':
      return Platform.LINUX
    default:
      return Platform.UNKNOWN
  }
}

/**
 * Get a human-readable platform name
 * @returns {string} Human-readable OS name (e.g., "macOS 14.0", "Windows 11", "Linux")
 */
export function getPlatformName() {
  const platform = getPlatform()
  const release = os.release()

  switch (platform) {
    case Platform.MACOS: {
      // Darwin kernel version to macOS version mapping (approximate)
      const majorVersion = parseInt(release.split('.')[0], 10)
      // Darwin 23.x = macOS 14 (Sonoma), 22.x = macOS 13, etc.
      const macOSVersion = majorVersion >= 20 ? majorVersion - 9 : majorVersion - 4
      return `macOS ${macOSVersion >= 14 ? macOSVersion : release}`
    }
    case Platform.WINDOWS:
      return `Windows (${release})`
    case Platform.LINUX:
      return `Linux (${release})`
    default:
      return `${process.platform} (${release})`
  }
}

/**
 * Check if running on macOS
 * @returns {boolean}
 */
export function isMacOS() {
  return process.platform === 'darwin'
}

/**
 * Check if running on Windows
 * @returns {boolean}
 */
export function isWindows() {
  return process.platform === 'win32'
}

/**
 * Check if running on Linux
 * @returns {boolean}
 */
export function isLinux() {
  return process.platform === 'linux'
}

export default {
  Platform,
  getPlatform,
  getPlatformName,
  isMacOS,
  isWindows,
  isLinux,
}
