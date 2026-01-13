import { IS_WINDOWS } from '#helpers/os-utils.js'
import { chdir, cwd } from 'node:process'
import { execaCommand } from 'execa'
import { fileURLToPath } from 'node:url'
import { isEmpty } from '#helpers/is-empty.js'
import config from '#lib/conf/config.js'
import fs from 'fs-extra'
import git from '#lib/git/index.js'
import npm from '#lib/npm/index.js'
import packageConfig from '#src/packageConfig.js'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Version install path is relative to process working directory
const INSTALL_PATH = path.join('src', 'lib', 'quire', 'versions')
const PACKAGE_NAME = '@thegetty/quire-11ty'

const QUIRE_VERSION = config.get('quireVersion')
const VERSION_FILE = config.get('versionFile')

/**
 * Return an absolute path to an installed quire-11ty version
 *
 * @return  {String}  path to installed quire-11ty version
 */
function getPath(version=QUIRE_VERSION) {
  const absolutePath = path.relative('/', path.join(INSTALL_PATH, version))
  if (!fs.existsSync(absolutePath)) {
    console.error(`[CLI:quire] quire-11ty@${version} is not installed`)
    return null
  }
  console.debug(`[CLI:quire] %s`, absolutePath)
  return absolutePath
}

/**
 * Read the required quire-11ty version for the quire version file
 *
 * @param    {String}   projectPath  Absolute system path to the project root
 *
 * @return  {String}  version  Quire-11ty semantic version
 */
function getVersion(projectPath) {
  projectPath = projectPath || path.resolve(cwd())
  const version = fs.readFileSync(path.join(projectPath, VERSION_FILE), { encoding:'utf8' })
  const projectName = path.basename(projectPath)
  console.debug(`${projectName} set to use quire-11ty@${version}`)
  return version
}

/**
 * Read required quire-11ty and starter versions from starter peerDependencies
 *
 * @param    {String}   projectPath  Absolute system path to the project root
 *
 * @return  {Object}
 * @property {String} quire11tyVersion  Latest compatible Quire-11ty semantic version
 * @property {String} starterVersion  Starter project version defined in the starter package.json
 */
async function getVersionsFromStarter(projectPath) {
  const projectPackageConfig = fs.readFileSync(path.join(projectPath, 'package.json'), { encoding:'utf8' })
  const { peerDependencies, version: starterVersion } = JSON.parse(projectPackageConfig)
  const quire11tyVersion = peerDependencies[PACKAGE_NAME]
  return { quire11tyVersion, starterVersion }
}

/**
 * Clone or copy a Quire starter project
 *
 * @param    {String}   starter   A repository URL or an absolute path to local starter
 * @TODO resolve both absolute and relative paths to local starter repositories 
 * @param    {String}   projectPath  Absolute system path to the project root
 *
 * @return   {String}   quireVersion  A string indicating the current version
 *                                    of quire being used with a new project
 */
async function initStarter (starter, projectPath, options) {
  projectPath = projectPath || cwd()

  // ensure that the target path exists
  fs.ensureDirSync(projectPath)

  // if the target directory exists it must be empty
  if (!isEmpty(projectPath)) {
    const location = projectPath === '.' ? 'the current directory' : projectPath
    console.error(`[CLI] cannot create a starter project in ${location} because it is not empty`)
    // @TODO cleanup directories from failed new command
    return
  }

  console.debug('[CLI:quire] init-starter',
    `\n  project: ${path.join(__dirname, projectPath)}`,
    `\n  starter: ${starter}`
  )

  /**
   * Clone starter project repository
   * @todo pipe `git clone` status to stdout for better UX
   */
  await git
    .cwd(projectPath)
    .clone(starter, '.')
    .catch((error) => console.error('[CLI:error] ', error))

  /**
   * Determine the quire-11ty version to use in the new project,
   * from the quireVersion option or as required by the starter project.
   *
   * Uses 'latest' to get the latest semantic version compatible with version ranges
   */
  const { quire11tyVersion, starterVersion } = await getVersionsFromStarter(projectPath)
  const quireVersion = await latest(options.quireVersion || quire11tyVersion)
  setVersion(projectPath, quireVersion)

  /**
   * Write quire-11ty, quire-cli, starter versions to the version file
   */
  const versionInfo = {
    cli: packageConfig.version,
    starter: `${starter}@${starterVersion}`,
  }
  fs.writeFileSync(path.join(projectPath, VERSION_FILE), JSON.stringify(versionInfo))

  // Re-initialize project directory as a new git repository
  await fs.remove(path.join(projectPath, '.git'))

  /**
   * Remove the starter repository package config file
   * and create a new package config for the project
   * (this is necessary for Eleventy to resolve project paths)
   * @todo allow interactive init using a custom questionnaire
   * @see https://docs.npmjs.com/creating-a-package-json-file#customizing-the-packagejson-questionnaire
   */
  await fs.remove(path.join(projectPath, 'package.json'))
  await npm.init(projectPath)

  /**
   * Create an initial commit of files in new repository
   * Using '.' respects .gitignore and avoids attempting to add ignored directories
   * @todo use a localized string for the commit message
   */
  await git.init().add('.').commit('Initial Commit')
  return quireVersion
}

/**
 * Install `quire-11ty` directly into a quire project
 *
 * @TODO refactor this to use the install method with pre and post-install hooks
 * or steps to prepare the working directory and cleanup on error and completion
 *
 * @param  {String}  projectPath  Absolute system path to the project root
 * @param  {Object}  options  options passed from `quire new` command
 * @return  {Promise}
 */
async function installInProject(projectPath, quireVersion, options = {}) {
  const { quirePath } = options
  const quire11tyPackage = `${PACKAGE_NAME}@${quireVersion}`

  console.debug(`[CLI:quire] installing ${quire11tyPackage} into ${projectPath}`)

  /**
   * Delete the starter project package configuration so that it can be replaced
   * with the `@thegetty/quire-11ty` configuration
   * @TODO If a user runs quire eject at a later date we may want to merge their
   * package.json with the `quire-11ty` dev dependencies, scripts, etc
   */
  await git
    .cwd(projectPath)
    .rm(['package.json'])
    .catch((error) => console.error('[CLI:error] ', error))

  const temp11tyDirectory = '.temp'
  const tempDir = path.join(projectPath,temp11tyDirectory)
  fs.mkdirSync(tempDir)

  // Copy if passed a path and it exists, otherwise attempt to download the tarball for this pathspec
  if (fs.existsSync(quirePath)) {
    fs.cpSync(quirePath, tempDir, {recursive: true})
  } else {
    await npm.pack(quire11tyPackage, tempDir, { debug: options.debug, quiet: !options.debug })

    // Extract only the package dir from the tar bar and strip it from the extracted path
    const tarballPath = path.join(tempDir, `thegetty-quire-11ty-${quireVersion}.tgz`)
    await execaCommand(`tar -xzf ${tarballPath} -C ${tempDir} --strip-components=1 package/`)

    fs.rmSync(tarballPath)
  }

  // Copy `.temp` to projectPath
  fs.cpSync(tempDir, projectPath, {recursive: true})

  console.debug('[CLI:quire] installing dev dependencies into quire project')
  /**
   * Manually install necessary dev dependencies to run 11ty;
   * these must be `devDependencies` so that they are not bundled into
   * the final `_site` package when running `quire build`
   *
   * Installing with --prefer-offline prioritizes local cache,
   * falling back to network only when necessary.
   * @see https://docs.npmjs.com/cli/v11/using-npm/config#prefer-offline
   */
  try {
    if (options.cleanCache) {
      // Nota bene: cache is self-healing, this should not be necessary.
      await npm.cacheClean(projectPath)
    }
    await npm.install(projectPath, { saveDev: true, preferOffline: true })
  } catch(error) {
    console.warn(`[CLI:error]`, error)
    fs.rmSync(projectPath, {recursive: true})
    return
  }

  /**
   * Create an additional commit of new `@thegetty/quire-11ty` files in repository
   * Using '.' respects .gitignore and avoids attempting to add ignored directories
   * @todo use a localized string for the commit message
   */
  await git.add('.').commit('Adds `@thegetty/quire-11ty` files')

  // remove temporary 11ty install directory
  fs.rmSync(path.join(projectPath, temp11tyDirectory), {recursive: true})
}

/**
 * Retrieve latest published version of the `quire-11ty` package
 * or the latest compatible version with the provided semantic version string
 * 
 * @param {String} version A semantic version string, i.e `^1.0.0-pre-release.0`
 * 
 * @return {String} `quire-11ty@latest` semantic version string
 */
async function latest(version) {
  let quireVersion;
  if (!version || version === 'latest') {
    quireVersion = await npm.view(PACKAGE_NAME, 'version')
  } else {
    quireVersion = await npm.getCompatibleVersion(PACKAGE_NAME, version)
  }
  if (!quireVersion) {
    throw new Error(`[CLI:quire] Sorry, we couldn't find a version of quire-11ty compatible with the version "${version}". You can set the quire-11ty version in the starter project's package.json or specify a version when running \`quire new\` with the \`--quire-version\` flag. You can run \`npm view @thegetty/quire-11ty versions\` to view all versions.`)
  }
  return quireVersion
}

/**
 * List installed versions of the `quire-11ty` package
 */
function list() {
  return fs.readdirSync(INSTALL_PATH)
}

/**
 * Removes the installed version of `quire-11ty`
 *
 * @param  {String}  `quire-11ty` semantic version
 * @return  {Promise}
 */
async function remove(version) {
  if (!version) {
    console.error('No version specified.')
  }
  const dir = `${INSTALL_PATH}/${version}`
  fs.rmdir(dir, { recursive: true }, (error) => {
    if (error) {
      throw error
    }
    console.info(`deleted ${dir}`)
  })
  symlinkLatest()
}

/**
 * Sets the quire-11ty version for a project
 *
 * @param  {String}  version  a version identifier or distribution tag
 */
function setVersion(projectPath, version) {
  const projectName = path.basename(projectPath)
  console.info(`${projectName} set to use quire-11ty@${version}`)
}

/**
 * Update symbolic link to the latest _installed_ version of `quire-11ty`
 *
 * @todo why does this not work using `fs-extra` `createSymlinkSync()`
 */
function symlinkLatest() {
  const latestInstalledVersion = fs
    .readdirSync(path.join(__dirname, 'versions'))
    .filter((dirent) => semver.valid(semver.coerce(dirent)))
    .sort(semver.rcompare)[0]
  const target = path.join(__dirname, 'versions', latestInstalledVersion)
  const source = path.join(__dirname, 'versions', 'latest')
  const type = IS_WINDOWS ? 'junction' : 'dir'

  console.debug('[CLI:quire] symlinking latest installed version')

  try {
    return fs.symlinkSync(target, source, type)
  } catch (error) {
    switch (error.code) {
      case 'EEXIST':
      case 'EISDIR':
        // if the target file already exists proceed...
        break
      case 'ENOENT':
        try {
          fs.mkdirSync(path.dirname(source))
        } catch (mkdirError) {
          mkdirError.message = `Error trying to symlink ${target} to ${source}`
          throw mkdirError
        }
        // do we need to symlink in this case?
        // return fs.symlinkSync(target, source, type)
        break
      default:
        console.error('[CLI:quire] unable to symlink latest installed version')
        throw error
    }
  }

  fs.unlinkSync(source)
  return fs.symlinkSync(target, source, type)
}

/**
 * Get an array of published `quire-11ty` package versions
 *
 * @return  {Array<String>}  published versions
 */
async function versions() {
  return await npm.show(PACKAGE_NAME, 'versions')
}

export const quire = {
  getPath,
  getVersion,
  initStarter,
  installInProject,
  latest,
  list,
  remove,
  setVersion,
  versions,
}
