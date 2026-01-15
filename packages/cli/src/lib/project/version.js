/**
 * Project version module
 *
 * Manages quire-11ty version files in Quire projects.
 *
 * @module lib/project/version
 */
import fs from 'fs-extra'
import path from 'node:path'
import config from '#lib/conf/config.js'
import paths from './paths.js'

const PACKAGE_NAME = '@thegetty/quire-11ty'
const VERSION_FILE = config.get('versionFile')

/**
 * Read the required quire-11ty version from the project version file
 *
 * @param {string} [projectPath] - Absolute system path to the project root
 * @returns {string} Quire-11ty semantic version
 */
export function getVersion(projectPath) {
  projectPath = projectPath || paths.getProjectRoot()
  const version = fs.readFileSync(path.join(projectPath, VERSION_FILE), { encoding: 'utf8' })
  const projectName = path.basename(projectPath)
  console.debug(`${projectName} set to use quire-11ty@${version}`)
  return version
}

/**
 * Sets the quire-11ty version for a project
 *
 * Updates the version file with the new quire-11ty version while
 * preserving other metadata (cli version, starter info).
 *
 * @param {string} version - A version identifier or distribution tag
 * @param {string} [projectPath] - Absolute path to project root (defaults to cwd)
 */
export function setVersion(version, projectPath) {
  projectPath = projectPath || paths.getProjectRoot()
  const projectName = path.basename(projectPath)
  const versionFilePath = path.join(projectPath, VERSION_FILE)

  // Read existing version info or create new
  let versionInfo = {}
  if (fs.existsSync(versionFilePath)) {
    const content = fs.readFileSync(versionFilePath, { encoding: 'utf8' })
    try {
      versionInfo = JSON.parse(content)
    } catch {
      // Legacy format or invalid JSON, start fresh
      versionInfo = {}
    }
  }

  // Update the quire-11ty version
  versionInfo.quire11ty = version

  // Write updated version info
  fs.writeFileSync(versionFilePath, JSON.stringify(versionInfo, null, 2))
  console.info(`${projectName} set to use quire-11ty@${version}`)
}

/**
 * Read required quire-11ty and starter versions from starter peerDependencies
 *
 * @param {string} projectPath - Absolute system path to the project root
 * @returns {Promise<Object>}
 * @property {string} quire11tyVersion - Latest compatible Quire-11ty semantic version
 * @property {string} starterVersion - Starter project version from package.json
 */
export async function getVersionsFromStarter(projectPath) {
  const projectPackageConfig = fs.readFileSync(
    path.join(projectPath, 'package.json'),
    { encoding: 'utf8' }
  )
  const { peerDependencies, version: starterVersion } = JSON.parse(projectPackageConfig)
  const quire11tyVersion = peerDependencies[PACKAGE_NAME]
  return { quire11tyVersion, starterVersion }
}

/**
 * Write version info to the project version file
 *
 * @param {string} projectPath - Absolute system path to the project root
 * @param {Object} versionInfo - Version information to write
 */
export function writeVersionFile(projectPath, versionInfo) {
  fs.writeFileSync(path.join(projectPath, VERSION_FILE), JSON.stringify(versionInfo))
}

/**
 * Read version info from the project version file
 *
 * @param {string} projectPath - Absolute system path to the project root
 * @returns {Object|null} Parsed version info or null if file doesn't exist
 */
export function readVersionFile(projectPath) {
  const versionFilePath = path.join(projectPath, VERSION_FILE)
  if (!fs.existsSync(versionFilePath)) {
    return null
  }
  const content = fs.readFileSync(versionFilePath, { encoding: 'utf8' })
  try {
    return JSON.parse(content)
  } catch {
    // Legacy format: plain version string
    return { version: content.trim() }
  }
}
