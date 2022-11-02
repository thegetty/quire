import { execa } from 'execa'
import fs from 'fs-extra'
import path from 'node:path'
import { cwd } from 'node:process'
import git from '#src/lib/git/index.js'
/**
 * Clone or copy a Quire starter project
 *
 * @param    {String}   starter   A repository URL or path to local starter
 * @param    {String}   rootPath  Absolute system path to the project root
 * @return   {Promise}
 */
export async function initStarter (starter, rootPath) {
  const remote = 'https://github.com/anderspollack/quire-starter-default'
  await git.cwd(rootPath)
  await git
    .clone(remote, '.')
    .catch((error) => console.error('[CLI:error] ', error));
  await fs.remove(path.join(rootPath, '.git'))
  // const files = ...
  // await fs.remove(files)
  // await git.init()
}
