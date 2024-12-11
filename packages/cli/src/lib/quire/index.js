import { IS_WINDOWS } from '#helpers/os-utils.js'
import { chdir, cwd } from 'node:process'
import { execa, execaCommand } from 'execa'
import { fileURLToPath } from 'node:url'
import { isEmpty } from '#helpers/is-empty.js'
import fetch from 'node-fetch'
import fs from 'fs-extra'
import git from '#src/lib/git/index.js'
import inv from 'install-npm-version'
import path from 'node:path'
import semver from 'semver'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const packagePath = path.join(__dirname, 'package.json')
const packageConfig = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

const { name: PACKAGE_NAME } = packageConfig

// Version install path is relative to process working directory
const INSTALL_PATH = path.join('src', 'lib', 'quire', 'versions')
const VERSION_FILE = '.quire'

/**
 * Return an absolute path to an installed `quire-11ty` version
 *
 * @return  {String}  path to installed `quire-11ty` version
 */
function getPath(version='latest') {
  const absolutePath = path.relative('/', `${INSTALL_PATH}/${version}`)
  if (!fs.existsSync(absolutePath)) {
    console.error(`[CLI:quire] \`quire-11ty@${version}\` is not installed`)
    return null
  }
  console.debug(`[CLI:quire] %s`, absolutePath)
  return absolutePath
}

/**
 * Read the required `quire-11ty` version for the project `.quire` file
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
 * Read the required `quire-11ty` and starter versions from starter `package.json` `peerDependencies`
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
    `\n  project root: "${projectPath}"`,
    `\n  starter: "${starter}"`
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
   * Determine the `quire-11ty` version to use in the new project,
   * from the `quireVersion` option or as required by the starter project.
   *
   * Uses `latest` to get the latest semantic version compatible with version ranges
   */
  const { quire11tyVersion, starterVersion } = await getVersionsFromStarter(projectPath)
  const quireVersion = await latest(options.quireVersion || quire11tyVersion)
  setVersion(projectPath, quireVersion)

  /**
   * Write quire-11ty, cli, starter name and version to VERSION_FILE
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
  await execaCommand('npm init --yes', { cwd: projectPath })

  /**
   * Create an initial commit of files in new repository
   * @todo use a localized string for the commit message
   */
  const projectFiles = fs.readdirSync(projectPath)
  await git.init().add(projectFiles).commit('Initial Commit')
  return quireVersion
}

/**
 * Install `quire-11ty`, default to 'latest' version
 *
 * @TODO refactor this to be callable by the installInProject method
 *
 * @param  {Object}  options  options passed from `quire new` command
 * @return  {Promise}
 */
async function install(options = {}) {
  const version = options.quireVersion || 'latest'
  console.debug(`[CLI:quire] installing quire-11ty@${version}`)
  const absoluteInstallPath = path.join(__dirname, 'versions')
  fs.ensureDirSync(absoluteInstallPath)
  /**
   * `Destination` is relative to `node_modules` of the working-directory
   * so we have included a relative path to parent directory in order to
   * install versions to a different local path.
   * @see https://github.com/scott-lin/install-npm-version
   */
  const installOptions = {
    Destination: path.join('..', version),
    Debug: false,
    Overwrite: options.force || options.overwrite || false,
    Verbosity: options.debug ? 'Debug' : 'Silent',
    WorkingDirectory: absoluteInstallPath
  }
  await inv.Install(`${PACKAGE_NAME}@${version}`, installOptions)

  // delete empty `node_modules` directory that `install-npm-version` creates
  const invNodeModulesDir = path.join(absoluteInstallPath, 'node_modules')
  if (fs.existsSync(invNodeModulesDir)) fs.rmdir(invNodeModulesDir)

  symlinkLatest()

  console.debug('[CLI:quire] installing dev dependencies')
  /**
   * Manually install necessary dev dependencies to run 11ty;
   * these must be `devDependencies` so that they are not bundled into
   * the final `_site` package when running `quire build`
   */
  const currentWorkingDirectory = cwd()
  const versionDir = path.join(absoluteInstallPath, version)
  chdir(versionDir)
  await execaCommand('npm cache clean --force')
  await execaCommand('npm install --save-dev')
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
  const quire11tyPackage = fs.existsSync(quirePath) ? quirePath : `${PACKAGE_NAME}@${quireVersion}`
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
  /**
   * `Destination` is relative to `node_modules` of the working-directory
   * so we have included a relative path to parent directory in order to
   * install versions to a different local path.
   * @see https://github.com/scott-lin/install-npm-version
   */
  const installOptions = {
    Destination: path.join('..', temp11tyDirectory),
    Debug: false,
    Overwrite: options.force || options.overwrite || false,
    Verbosity: options.debug ? 'Debug' : 'Silent',
    WorkingDirectory: projectPath
  }
  await inv.Install(quire11tyPackage, installOptions)

  // delete empty `node_modules` directory that `install-npm-version` creates
  const invNodeModulesDir = path.join(projectPath, 'node_modules')
  if (fs.existsSync(invNodeModulesDir)) fs.rmdir(invNodeModulesDir)

  // Copy all files installed in `.temp` to projectPath
  fs.copySync(path.join(projectPath, '.temp'), projectPath)

  console.debug('[CLI:quire] installing dev dependencies into quire project')
  /**
   * Manually install necessary dev dependencies to run 11ty;
   * these must be `devDependencies` so that they are not bundled into
   * the final `_site` package when running `quire build`
   */
  await execaCommand('npm cache clean --force', { cwd: projectPath })
  try {
    await execaCommand('npm install --save-dev', { cwd: projectPath })
  } catch(error) {
    console.warn(`[CLI:error]`, error)
    fs.removeSync(projectPath)
    return
  }

  const eleventyFilesToCommit = fs
    .readdirSync(path.join(projectPath, temp11tyDirectory))
    .filter((filePath) => filePath !== 'node_modules')

  eleventyFilesToCommit.push('package-lock.json')

  /**
   * Create an additional commit of new `@thegetty/quire-11ty` files in repository
   * @todo use a localized string for the commit message
   */
  await git.add(eleventyFilesToCommit).commit('Adds `@thegetty/quire-11ty` files')

  // remove temporary 11ty install directory
  fs.removeSync(path.join(projectPath, temp11tyDirectory))
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
    const { stdout } = 
      await execa('npm', ['view', PACKAGE_NAME, 'version'])
    quireVersion = stdout
  } else {
    const response = await fetch(`https://registry.npmjs.org/${PACKAGE_NAME}`)
    const json = await response.json()
    const versions = Object.keys(json.versions)
    quireVersion = semver.maxSatisfying(versions, version)
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
 * Tests if a `quire-11ty` version is already installed
 * and installs the version if it is not already installed.
 *
 * @param  {String}  version  `quire-11ty` semantic version
 */
function testVersion(version) {
  version ||= getVersion()
  if (!versions.includes(version)) {
    install(version)
  }
}

/**
 * Get an array of published `quire-11ty` package versions
 *
 * @return  {Array<String>}  published versions
 */
async function versions() {
  return await execa('npm', ['show', PACKAGE_NAME, 'versions'])
}

export const quire = {
  getPath,
  getVersion,
  initStarter,
  install,
  installInProject,
  latest,
  list,
  remove,
  setVersion,
  testVersion,
  versions,
}
