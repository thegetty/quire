/**
 * Installer module
 *
 * Handles installation of quire-11ty into Quire projects,
 * including starter project initialization and dependency setup.
 *
 * @module lib/installer
 */
import { IS_WINDOWS } from '#helpers/os-utils.js'
import { execaCommand } from 'execa'
import { fileURLToPath } from 'node:url'
import { isEmpty } from '#helpers/is-empty.js'
import fs from 'fs-extra'
import { Git } from '#lib/git/index.js'
import npm from '#lib/npm/index.js'
import packageConfig from '#src/packageConfig.js'
import path from 'node:path'
import {
  getVersionsFromStarter,
  setVersion,
  writeVersionFile,
} from '#lib/project/index.js'
import { VersionNotFoundError } from '#src/errors/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PACKAGE_NAME = '@thegetty/quire-11ty'

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
    throw new VersionNotFoundError(version)
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

  // Ensure that the target path exists
  fs.ensureDirSync(projectPath)

  // If the target directory exists it must be empty
  if (!isEmpty(projectPath)) {
    const location = projectPath === '.' ? 'the current directory' : projectPath
    throw new Error(`[CLI:installer] cannot create project in a non-empty directory ${location}`)
  }

  console.debug('[CLI:installer] init-starter',
    `\n  project: ${path.join(__dirname, projectPath)}`,
    `\n  starter: ${starter}`
  )

  /**
   * Clone starter project repository
   */
  const repo = new Git(projectPath)
  await repo.clone(starter, '.')

  /**
   * Determine the quire-11ty version to use in the new project,
   * from the quireVersion option or as required by the starter project.
   *
   * Uses 'latest' to get the latest semantic version compatible with version ranges
   */
  const { quire11tyVersion, starterVersion } = await getVersionsFromStarter(projectPath)
  const quireVersion = await latest(options.quireVersion || quire11tyVersion)
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
  await repo.init()
  await repo.add('.')
  await repo.commit('Initial Commit')
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

  console.debug(`[CLI:installer] installing ${quire11tyPackage} into ${projectPath}`)

  /**
   * Delete the starter project package configuration so that it can be replaced
   * with the @thegetty/quire-11ty configuration
   */
  const repo = new Git(projectPath)
  try {
    await repo.rm(['package.json'])
  } catch (error) {
    console.error('[CLI:installer] ', error)
  }

  const temp11tyDirectory = '.temp'
  const tempDir = path.join(projectPath, temp11tyDirectory)
  fs.mkdirSync(tempDir)

  // Copy if passed a path and it exists, otherwise attempt to download the tarball
  if (fs.existsSync(quirePath)) {
    fs.cpSync(quirePath, tempDir, { recursive: true })
  } else {
    await npm.pack(quire11tyPackage, tempDir, { debug: options.debug, quiet: !options.debug })

    // Extract only the package dir from the archive and strip it from the extracted path
    const tarballPath = path.join(tempDir, `thegetty-quire-11ty-${quireVersion}.tgz`)
    await execaCommand(`tar -xzf ${tarballPath} -C ${tempDir} --strip-components=1 package/`)

    fs.rmSync(tarballPath)
  }

  // Copy `.temp` to projectPath
  fs.cpSync(tempDir, projectPath, { recursive: true })

  console.debug('[CLI:installer] installing dev dependencies into quire project')

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
    console.warn(`[CLI:installer]`, error)
    fs.rmSync(projectPath, { recursive: true })
    return
  }

  // Remove temporary 11ty install directory before committing
  // to avoid including install artifacts in the commit
  fs.rmSync(path.join(projectPath, temp11tyDirectory), { recursive: true })

  /**
   * Create an additional commit of new @thegetty/quire-11ty files in repository
   * Using '.' respects .gitignore and avoids attempting to add ignored directories
   */
  await repo.add('.')
  await repo.commit('Adds `@thegetty/quire-11ty` files')
}

/**
 * Export installer functions
 */
export const installer = {
  initStarter,
  installInProject,
  latest,
  versions,
}
