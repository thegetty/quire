/**
 * Installer module
 *
 * Handles installation of quire-11ty into Quire projects,
 * including starter project initialization and dependency setup.
 *
 * @module lib/installer
 */
import { execa } from 'execa'
import { fileURLToPath } from 'node:url'
import { isEmpty } from '#helpers/is-empty.js'
import fs from 'fs-extra'
import { Git, validateCloneSource } from '#lib/git/index.js'
import npm from '#lib/npm/index.js'
import packageConfig from '#src/packageConfig.js'
import path from 'node:path'
import {
  getVersionsFromStarter,
  setVersion,
  writeVersionFile,
} from '#lib/project/index.js'
import { DirectoryNotEmptyError, InvalidPathError, InvalidStarterError, VersionNotFoundError } from '#src/errors/index.js'
import { logger } from '#lib/logger/index.js'
import createDebug from '#debug'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = createDebug('lib:installer')

const PACKAGE_NAME = '@thegetty/quire-11ty'

/**
 * Read the version from a local quire-11ty package
 *
 * @param {string} quirePath - Path to local quire-11ty package (will be resolved)
 * @returns {{ version: string, resolvedPath: string }} Version and resolved path
 * @throws {InvalidPathError} When the path does not exist
 * @throws {VersionNotFoundError} When the package.json is missing or has no version
 */
export function getVersionFromPath(quirePath) {
  const resolvedPath = path.resolve(quirePath)
  debug('reading version from local path: %s (resolved: %s)', quirePath, resolvedPath)

  if (!fs.existsSync(resolvedPath)) {
    throw new InvalidPathError(quirePath, resolvedPath)
  }

  const localPackageJsonPath = path.join(resolvedPath, 'package.json')
  if (!fs.existsSync(localPackageJsonPath)) {
    throw new VersionNotFoundError(resolvedPath, 'package.json not found')
  }

  try {
    const localPackage = fs.readJsonSync(localPackageJsonPath)
    if (!localPackage.version) {
      throw new VersionNotFoundError(resolvedPath, 'package.json has no version field')
    }
    return { version: localPackage.version, resolvedPath }
  } catch (error) {
    if (error.code === 'VERSION_NOT_FOUND') {
      throw error
    }
    throw new VersionNotFoundError(
      resolvedPath,
      `Failed to read package.json: ${error.message}`
    )
  }
}

/**
 * Retrieve latest published version of the quire-11ty package
 * or the latest compatible version with the provided semantic version string
 *
 * @param {string} version - A semantic version string, e.g. `^1.0.0-pre-release.0`
 * @returns {Promise<string>} quire-11ty semantic version string
 */
export async function latest(version) {
  let quireVersion
  if (!version || version === 'latest') {
    quireVersion = await npm.view(PACKAGE_NAME, 'version')
  } else {
    quireVersion = await npm.getCompatibleVersion(PACKAGE_NAME, version)
  }
  if (!quireVersion) {
    throw new VersionNotFoundError(PACKAGE_NAME, version)
  }
  return quireVersion
}

/**
 * Get an array of published quire-11ty package versions
 *
 * @returns {Promise<Array<string>>} Published versions
 */
export async function versions() {
  return await npm.show(PACKAGE_NAME, 'versions')
}

/**
 * Clone or copy a Quire starter project
 *
 * @param {string} starter - A repository URL or an absolute path to local starter
 * @param {string} projectPath - Absolute system path to the project root
 * @param {Object} options - Installation options
 * @returns {Promise<string>} quireVersion - The quire-11ty version for the new project
 */
export async function initStarter(starter, projectPath, options = {}) {
  projectPath = projectPath || process.cwd()

  /**
   * Validate arguments before any side effects (directory creation, cloning)
   */

  // Validate starter is a valid clone source (URL or local git repo)
  const starterValidation = validateCloneSource(starter)
  if (!starterValidation.valid) {
    throw new InvalidStarterError(starter, starterValidation.reason)
  }

  // Validate --quire-path points to a valid local quire-11ty package
  let localQuire11tyInfo
  if (options.quirePath) {
    localQuire11tyInfo = getVersionFromPath(options.quirePath)
  }

  // Ensure that the target path exists
  fs.ensureDirSync(projectPath)

  // If the target directory exists it must be empty
  if (!isEmpty(projectPath)) {
    throw new DirectoryNotEmptyError(projectPath)
  }

  const fullPath = path.join(__dirname, projectPath)
  debug(`init-starter\n  project: ${fullPath}\n  starter: ${starter}`)

  /**
   * Clone starter project repository
   */
  const repository = new Git(projectPath)
  await repository.clone(starter, '.')

  /**
   * Determine the quire-11ty version to use in the new project:
   * 1. If --quire-path is provided, use the version from the local package (already validated)
   * 2. Otherwise, use --quire-version option or the version required by the starter
   *
   * Uses 'latest' to get the latest semantic version compatible with version ranges
   */
  const { quire11tyVersion, starterVersion } = await getVersionsFromStarter(projectPath)

  let quireVersion
  if (localQuire11tyInfo) {
    // Use the pre-validated local quire-11ty package
    const { version, resolvedPath } = localQuire11tyInfo
    quireVersion = version
    logger.info(`Using local quire-11ty: ${version} from ${resolvedPath}`)
  } else {
    quireVersion = await latest(options.quireVersion || quire11tyVersion)
  }

  setVersion(quireVersion, projectPath)

  /**
   * Write quire-11ty, quire-cli, starter versions to the version file
   */
  const versionInfo = {
    cli: packageConfig.version,
    starter: `${starter}@${starterVersion}`,
  }
  writeVersionFile(projectPath, versionInfo)

  // Re-initialize project directory as a new git repository
  await fs.remove(path.join(projectPath, '.git'))

  /**
   * Remove the starter repository package config file
   * and create a new package config for the project
   * (this is necessary for Eleventy to resolve project paths)
   */
  await fs.remove(path.join(projectPath, 'package.json'))
  await npm.init(projectPath)

  /**
   * Create an initial commit of files in new repository
   * Using '.' respects .gitignore and avoids attempting to add ignored directories
   */
  await repository.init()
  await repository.add('.')
  await repository.commit('Initial Commit')
  return quireVersion
}

/**
 * Install quire-11ty directly into a Quire project
 *
 * @param {string} projectPath - Absolute system path to the project root
 * @param {string} quireVersion - quire-11ty version to install
 * @param {Object} options - Installation options
 * @param {string} [options.quirePath] - Local path to quire-11ty package
 * @param {boolean} [options.debug] - Enable debug output
 * @param {boolean} [options.cleanCache] - Force clean npm cache before install
 * @returns {Promise<void>}
 */
export async function installInProject(projectPath, quireVersion, options = {}) {
  const { quirePath } = options
  const quire11tyPackage = `${PACKAGE_NAME}@${quireVersion}`

  debug('installing %s into %s', quire11tyPackage, projectPath)

  /**
   * Delete the starter project package configuration so that it can be replaced
   * with the @thegetty/quire-11ty configuration
   */
  const repository = new Git(projectPath)
  try {
    await repository.rm(['package.json'])
  } catch (error) {
    debug('error removing package.json: %O', error)
  }

  const temp11tyDirectory = '.temp'
  const tempDir = path.join(projectPath, temp11tyDirectory)
  fs.mkdirSync(tempDir)

  // Copy if passed a path, otherwise attempt to download the tarball
  if (quirePath) {
    // Normalize the path to handle relative paths and `..` segments
    // Nota bene: Path validation is done in initStarter via getVersionFromPath,
    // but we validate again here to support direct calls to installInProject
    const resolvedPath = path.resolve(quirePath)
    debug('using local quire-11ty path: %s (resolved: %s)', quirePath, resolvedPath)

    if (!fs.existsSync(resolvedPath)) {
      throw new InvalidPathError(quirePath, resolvedPath)
    }

    fs.cpSync(resolvedPath, tempDir, { recursive: true })
  } else {
    await npm.pack(quire11tyPackage, tempDir, { debug: options.debug, quiet: !options.debug })

    // Extract only the package dir from the archive and strip it from the extracted path
    // Nota bene: Use array-based execa() to prevent command injection via path variables
    const tarballPath = path.join(tempDir, `thegetty-quire-11ty-${quireVersion}.tgz`)
    await execa('tar', ['-xzf', tarballPath, '-C', tempDir, '--strip-components=1', 'package/'])

    fs.rmSync(tarballPath)
  }

  // Copy `.temp` to projectPath
  fs.cpSync(tempDir, projectPath, { recursive: true })

  debug('installing dev dependencies into quire project')

  /**
   * Manually install necessary dev dependencies to run 11ty;
   * these must be devDependencies so that they are not bundled into
   * the final _site package when running `quire build`
   *
   * Installing with --prefer-offline prioritizes local cache,
   * falling back to network only when necessary.
   */
  try {
    if (options.cleanCache) {
      // Nota bene: cache is self-healing, this should not be necessary.
      await npm.cacheClean(projectPath)
    }
    await npm.install(projectPath, { saveDev: true, preferOffline: true })
  } catch (error) {
    logger.warn('Failed to install dependencies')
    debug('install error: %O', error)
    // Nota bene: Auto-deletion of projectPath is disabled to prevent accidental data loss.
    // The project directory may contain user content that predates this install attempt.
    // TODO: Implement safe cleanup that tracks whether we created the directory.
    throw error
  }

  // Remove temporary 11ty install directory before committing
  // to avoid including install artifacts in the commit
  fs.rmSync(path.join(projectPath, temp11tyDirectory), { recursive: true })

  /**
   * Create an additional commit of new @thegetty/quire-11ty files in repository
   * Using '.' respects .gitignore and avoids attempting to add ignored directories
   */
  await repository.add('.')
  await repository.commit('Adds `@thegetty/quire-11ty` files')
}

/**
 * Export installer functions
 */
export const installer = {
  getVersionFromPath,
  initStarter,
  installInProject,
  latest,
  versions,
}
