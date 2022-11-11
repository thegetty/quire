import { chdir, cwd } from 'node:process'
import { execa, execaCommand } from 'execa'
import { fileURLToPath } from 'node:url'
import { isEmpty } from '#helpers/is-empty.js'
import fs from 'fs-extra'
import git from '#src/lib/git/index.js'
import inv from 'install-npm-version'
import path from 'node:path'
import semver from 'semver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Version install path is relative to process working directory
const INSTALL_PATH = path.join('src', 'lib', 'quire', 'versions')
const PACKAGE_NAME = '@thegetty/quire-11ty'
const VERSION_FILE = '.quire'

const IS_WINDOWS =
  process.platform === 'win32' || /^(cygwin|msys)$/.test(process.env.OSTYPE)

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
  console.debug(`[CLI:quire] \%`, absolutePath)
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
  // const fullProjectPath = path.resolve(projectPath)
  // const eleventyPath = path.resolve(path.join(INSTALL_PATH, quireVersion))
  // const eleventyFiles = fs.readdirSync(eleventyPath)

  // copies all files in `quire/packages/11ty`
  // eleventyFiles.forEach((filePath) => {
  //   const fileToCopy = path.resolve(eleventyPath, filePath)
  //   fs.copySync(fileToCopy, path.join(fullProjectPath, path.basename(filePath)))
  // })

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
async function install(version='latest', options={}) {
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
    Destination: path.join('../', version),
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
   * Install dev dependencies manually, as they are necessary to run 11ty.
   * They should be kept as dev dependencies so that they don't get bundled into
   * the final compiled `_site` package when running `quire build`
   */
  const currentWorkingDirectory = cwd()
  const versionDir = path.join(absoluteInstallPath, version)
  chdir(versionDir)
  await execaCommand(
    'npm cache clean --force'
  ).stdout.pipe(process.stdout)
  await execaCommand(
    'npm install --save-dev'
  ).stdout.pipe(process.stdout)
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
 * @todo why does this not work using `fs-extra` `createSymlinkSync()`
 */
function symlinkLatest() {
  const latestInstalledVersion = fs
    .readdirSync(path.join(__dirname, 'versions'))
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
  latest,
  list,
  remove,
  setVersion,
  testVersion,
  versions,
}
