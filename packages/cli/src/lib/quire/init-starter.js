import { cwd } from 'node:process'
import fs from 'fs-extra'
import git from '#src/lib/git/index.js'
import installNpmVersion from 'install-npm-version'
import { isEmpty } from '#helpers/is-empty.js'
import path from 'node:path'
import { quire } from '#src/lib/quire/index.js'

/**
 * Nota bene: importing JSON is experimental in Node ES6 modules,
 * instead read the file synchronosly and parse contents as JSON.
 *
 * pull version information from the published packaged
 */
const {
  name: quirePackageName,
  version: quireVersion
} = JSON.parse(fs.readFileSync('../11ty/package.json', 'utf8'))

/**
 * Clone or copy a Quire starter project
 *
 * @param    {String}   starter   A repository URL or path to local starter
 * @param    {String}   projectPath  Absolute system path to the project root
 * @param    {String}   quireVersion  A string indicating the current version
 * of quire being used with a new project
 * @return   {Promise}
 */
export async function initStarter (starter, projectPath) {
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

  console.log('[CLI:init-starter]', `project root: ${projectPath}`, `starter project: ${starter}`)

  // @TODO refactor to use `quire.latest()` to grab latest quire version from NPM
  await quire.install(quireVersion, quirePackageName)

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
  const projectConfig = `${quireVersion}\n`
  const configFilePath = path.join(projectPath, '.quire')
  fs.writeFileSync(configFilePath, projectConfig)

  // Copy 11ty files
  const fullProjectPath = path.resolve(projectPath)
  const eleventyPath = path.resolve(cwd(), path.join(quire.INSTALL_PATH, quireVersion))
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
