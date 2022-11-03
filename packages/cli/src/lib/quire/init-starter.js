import { cwd } from 'node:process'
import fs from 'fs-extra'
import git from '#src/lib/git/index.js'
import path from 'node:path'
/**
 * Clone or copy a Quire starter project
 *
 * @param    {String}   starter   A repository URL or path to local starter
 * @param    {String}   rootPath  Absolute system path to the project root
 * @return   {Promise}
 */
export async function initStarter (starter, rootPath, quireVersion) {
  const remote = 'https://github.com/thegetty/quire-starter-default'

  // Clone starter project repository
  await git
    .cwd(rootPath)
    .clone(remote, '.')
    .catch((error) => console.error('[CLI:error] ', error))

  // Copy 11ty files
  const fullRootPath = path.resolve(rootPath)
  const eleventyPath = path.resolve(cwd(), path.join('quire', 'versions', quireVersion))
  const eleventyFiles = fs.readdirSync(eleventyPath)

  // copies all files in `quire/packages/11ty`
  eleventyFiles.forEach((filePath) => {
    const fileToCopy = path.resolve(eleventyPath, filePath)
    fs.copySync(fileToCopy, path.join(fullRootPath, path.basename(filePath)))
  })

  // Reinitialize project as a new git repository
  await fs.remove(path.join(rootPath, '.git'))

  const starterFiles = fs.readdirSync(rootPath)

  // @TODO add localized string for commit message
  await git.init().add(starterFiles).commit('Initial Commit')
}
