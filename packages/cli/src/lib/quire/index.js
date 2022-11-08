import { cwd } from 'node:process'
import fs from 'fs-extra'
import hostedGitInfo from 'hosted-git-info'
import installNpmVersion from 'install-npm-version'
import path from 'node:path'
import semver from 'semver'

const INSTALL_PATH = path.join('./', 'src', 'lib', 'quire', 'versions')
const VERSION_FILE = '.quire'

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
 * Install a specific version of `quire-11ty`
 *
 * If a `version` argument is not given `latest` is assumed.
 *
 * @param  {String}  version  Quire-11ty semantic version
 * @return  {Promise}
 */
async function install(version='latest', packageName) {
  fs.ensureDirSync(INSTALL_PATH)
  await installNpmVersion.Install(
    `${packageName}@${version}`,
    {
      Destination: `${INSTALL_PATH}/${version}`,
      Debug: true
    }
  )

  // @FIXME this throws an error if symlink already exists, which is fine
  fs.symlink(`${INSTALL_PATH}/latest`, version, 'dir', (error) => {
    console.error('[CLI:quire.install]', error)
  })
}

/**
 * Retrieves version from quire repository `packages/11ty/package.json`
 *
 * Note: This does not currently work, as quire-11ty work is not on the main
 * branch yet, and `hosted-git-info` does not provide a mechanism for
 * retrieving file URLs on specific code branches. But it will!
 *
 * @TODO Once 11ty work is merged into main, this static method should replace
 * the `quireVersion` import, and should be refactored to use NPM instead of
 * hosted-git-info
 *
 * @TODO update .node-version to `>=18` for native fetch
 *
 * @return {String} the current version of thegetty/quire/packages/11ty
 */
async function latest() {
  const latestQuirePackageJsonUrl = hostedGitInfo
    .fromUrl('git@github.com:thegetty/quire.git')
    .file('packages/11ty/package.json')
  const latestQuirePackageJsonRequest = await fetch(latestQuirePackageJsonUrl)
  const latestQuirePackageJson = await latestQuirePackageJsonRequest.json()
  const { version } = latestQuirePackageJson
  return version
}

/**
 * List installed versions of the `quire-11ty` package
 */
function list() {
  return fs.readDirSync(INSTALL_PATH)
}

/**
 * Removes the specified version.
 *
 * @param  {String}  version  Quire-11ty semantic version
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
  // update symlink to `latest` version
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
 * Tests if a `quire-11ty` version is already installed
 * and installs the version if it is not already installed.
 *
 * @param  {String}  version  Quire-11ty semantic version
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
  install,
  INSTALL_PATH,
  latest,
  list,
  remove,
  setVersion,
  testVersion,
  versions,
}
