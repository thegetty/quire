import fs from 'fs-extra'
import path from 'node:path'
import git from '#src/lib/git/index.js'
/**
 * Clone or copy a Quire starter project
 *
 * @param    {String}   starter   A repository URL or path to local starter
 * @param    {String}   rootPath  Absolute system path to the project root
 * @return   {Promise}
 */
export async function initStarter (starter, rootPath) {
  const remote = 'https://github.com/thegetty/quire-starter-default'

  await git.cwd(rootPath)
  await git
    .clone(remote, '.')
    .catch((error) => console.error('[CLI:error] ', error));
  await fs.remove(path.join(rootPath, '.git'))

  const starterFiles = fs.readdirSync(rootPath)

  await git.init()
  await git.add(starterFiles)
  await git.commit('Initial Commit')
  await git.log()
}
