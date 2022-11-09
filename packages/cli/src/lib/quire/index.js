import { cwd } from 'node:process'
import { execa } from 'execa'
import { fileURLToPath } from 'node:url'
import { isEmpty } from '#helpers/is-empty.js'
import fs from 'fs-extra'
import git from '#src/lib/git/index.js'
import inv from 'install-npm-version'
import path from 'node:path'
import semver from 'semver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INSTALL_PATH = path.join('src', 'lib', 'quire', 'versions')
const PACKAGE_NAME = '@thegetty/quire-11ty'
const VERSION_FILE = '.quire'

const IS_WINDOWS =
  process.platform === 'win32' || /^(cygwin|msys)$/.test(process.env.OSTYPE)

/**
 * Return full path to the required `quire-11ty` version
 *
 * @return  {String}  version  Quire-11ty semantic version
 */
function getPath(version='latest') {
  // console.debug(`${projectName} set to use quire-11ty@${version}`)
  // return versionPath
}

/**
 * Read the required `quire-11ty` version for the project `.quire` file
 *
 * @return  {String}  version  Quire-11ty semantic version
 */
function getVersion() {
  // console.debug(`${projectName} set to use quire-11ty@${version}`)
  // return version
}

/**
 * Clone or copy a Quire starter project
 *
 * @param    {String}   starter   A repository URL or path to local starter
 * @param    {String}   projectPath  Absolute system path to the project root
 * @param    {String}   quireVersion  A string indicating the current version
 * of quire being used with a new project
 * @return   {Promise}
 */
async function initStarter (starter, projectPath) {
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

  starter = starter || 'https://github.com/thegetty/quire-starter-default'

  console.debug('[CLI:quire] init-starter',
    `\n  project root: "${projectPath}"`,
    `\n  starter: "${starter}"`
  )

  // Clone starter project repository
  // @TODO pipe `git clone` status to stdout for better UX
  await git
    .cwd(projectPath)
    .clone(starter, '.')
    .catch((error) => console.error('[CLI:error] ', error))

  /**
   * Quire project dot configuration file
   *
   * writes the quire-11ty semantic version to a `.quire` file
   */
  const quireVersion = await latest()
  const versionFilePath = path.join(projectPath, VERSION_FILE)
  fs.writeFileSync(versionFilePath, quireVersion)

  // @TODO Remove 11ty file copying code (lines 79-88) once CLI pathing issues have been sorted out
  // Copy 11ty files
  const fullProjectPath = path.resolve(projectPath)
  const eleventyPath = path.resolve(path.join(INSTALL_PATH, quireVersion))
  const eleventyFiles = fs.readdirSync(eleventyPath)

  // copies all files in `quire/packages/11ty`
  eleventyFiles.forEach((filePath) => {
    const fileToCopy = path.resolve(eleventyPath, filePath)
    fs.copySync(fileToCopy, path.join(fullProjectPath, path.basename(filePath)))
  })

  // Reinitialize project as a new git repository
  await fs.remove(path.join(projectPath, '.git'))

  // don't git-add copied `node_modules`
  const starterFiles = fs
    .readdirSync(projectPath)
    .filter((filePath) => filePath !== 'node_modules')

  // @TODO add localized string for commit message
  await git.init().add(starterFiles).commit('Initial Commit')
}

/**
 * Install a specific version of `quire-11ty`
 *
 * If a `version` argument is not given `latest` is assumed.
 *
 * @param  {String}  version  Quire-11ty semantic version
 * @return  {Promise}
 */
async function install(version='latest') {
  console.debug(`[CLI:quire] installing quire-11ty@${version}`)
  fs.ensureDirSync(INSTALL_PATH)
  /**
   * Destination is relative to `node_modules` of the working-directory
   * so we have included a relative path to parent directory to install
   * versions to a different local path.
   * @see https://github.com/scott-lin/install-npm-version
   */
  const options = {
    Destination: path.join('../', INSTALL_PATH, version),
    Debug: false,
    Verbosity: 'Silent',
  }
  await inv.Install(`${PACKAGE_NAME}@${version}`, options)
  symlinkLatest()
}

/**
 * Retrieve latest published version of the `quire-11ty` package
 *
 * @return {String} `quire-11ty@latest` semantic version string
 */
async function latest() {
  const { stdout: quireVersion } =
    await execa('npm', ['view', PACKAGE_NAME, 'version'])
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
 * @param  {String}  version  Quire-11ty semantic version
 */
function setVersion(version) {
  if (!version) {
    console.error('No version specified')
    // return version from config
    // version =
  }
  console.info(`${projectName} set to use quire-11ty@${version}`)
}

/**
 * Update symbolic link to the latest _installed_ version of `quire-11ty`
 *
 * @todo refactor to determine latest _installed_ version using the semver
 * package methods to sort and compare the locally installed versions.
 */
function symlinkLatest() {
  const version = fs.readdirSync(INSTALL_PATH).sort()[0]
  const target = path.relative(__dirname, path.join(INSTALL_PATH, version))
  const source = path.join(INSTALL_PATH, 'latest')
  const type = IS_WINDOWS ? 'junction' : 'dir'

  console.debug('[CLI:quire] symlinking latest')

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
 * List known versions of the `quire-11ty` package
 * @todo use npm for this
 */
function versions() {
  console.info(`Known versions of @thegetty/quire-11ty...`)
}

export const quire = {
  getPath,
  getVersion,
  initStarter,
  install,
  latest,
  list,
  remove,
  setVersion,
  testVersion,
  versions,
}
