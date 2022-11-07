import { cwd } from 'node:process'
import fs from 'fs-extra'
import git from '#src/lib/git/index.js'
import path from 'node:path'
/**
 * Clone or copy a Quire starter project
 *
 * @param    {String}   starter   A repository URL or path to local starter
 * @param    {String}   projectRoot  Absolute system path to the project root
 * @param    {String}   quireVersion  A string indicating the current version
 * of quire being used with a new project
 * @return   {Promise}
 */
export async function initStarter (starter, projectRoot, quireVersion) {
  const remote = 'https://github.com/thegetty/quire-starter-default'

  // Clone starter project repository
  // @TODO pipe `git clone` status to stdout for better UX
  await git
    .cwd(projectRoot)
    .clone(remote, '.')
    .catch((error) => console.error('[CLI:error] ', error))

  /**
   * Quire project dot configuration file
   *
   * writes the quire-11ty semantic version to a `.quire` file
   */
  const projectConfig = `${quireVersion}\n`
  const configFilePath = path.join(projectRoot, '.quire')
  fs.writeFileSync(configFilePath, projectConfig)

  // Copy 11ty files
  const fullProjectRootPath = path.resolve(projectRoot)
  const eleventyPath = path.resolve(cwd(), path.join('quire', 'versions', quireVersion))
  const eleventyFiles = fs.readdirSync(eleventyPath)

  // copies all files in `quire/packages/11ty`
  eleventyFiles.forEach((filePath) => {
    const fileToCopy = path.resolve(eleventyPath, filePath)
    fs.copySync(fileToCopy, path.join(fullProjectRootPath, path.basename(filePath)))
  })

  // Reinitialize project as a new git repository
  await fs.remove(path.join(projectRoot, '.git'))

  // don't git-add copied `node_modules`
  const starterFiles = fs
    .readdirSync(projectRoot)
    .filter((filePath) => filePath !== 'node_modules')

  // @TODO add localized string for commit message
  await git.init().add(starterFiles).commit('Initial Commit')
}
