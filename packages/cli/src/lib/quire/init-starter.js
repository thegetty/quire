import { basename, join, resolve } from 'node:path'
import { cwd } from 'node:process'
import fs from 'fs-extra'
import git from '#src/lib/git/index.js'
/**
 * Clone or copy a Quire starter project
 *
 * @param    {String}   starter   A repository URL or path to local starter
 * @param    {String}   projectRoot  Absolute system path to the project root
 * @return   {Promise}
 */
export async function initStarter (starter, projectRoot, quire11tyVersion) {
  const remote = 'https://github.com/thegetty/quire-starter-default'

  // Clone starter project repository
  await git
    .cwd(projectRoot)
    .clone(remote, '.')
    .catch((error) => console.error('[CLI:error] ', error))

  // write project config to project
  const projectConfig = {
    projectRoot: resolve(projectRoot),
    version: quire11tyVersion
  }
  const configFilePath = join(projectRoot, 'project.json')
  const configJSON = JSON.stringify(projectConfig, null, 2)
  fs.writeFileSync(configFilePath, configJSON)

  // Copy 11ty files
  const fullProjectRootPath = resolve(projectRoot)
  const eleventyPath = resolve(cwd(), join('quire', 'versions', quire11tyVersion))
  // @TODO remove `.env` and `_site` from published `quire-11ty` NPM package
  const eleventyIgnoreFiles = ['.env', '_site']
  const eleventyFiles = fs
    .readdirSync(eleventyPath)
    .filter((filePath) => !eleventyIgnoreFiles.includes(filePath))

  // copies all files in `quire/packages/11ty`
  eleventyFiles.forEach((filePath) => {
    const fileToCopy = resolve(eleventyPath, filePath)
    if (!eleventyIgnoreFiles.includes(filePath)) {
      fs.copySync(fileToCopy, join(fullProjectRootPath, basename(filePath)))
    }
  })

  // Reinitialize project as a new git repository
  await fs.remove(join(projectRoot, '.git'))

  // don't git-add copied `node_modules`
  const starterFiles = fs
    .readdirSync(projectRoot)
    .filter((filePath) => ![...eleventyIgnoreFiles, 'node_modules'].includes(filePath))

  // @TODO add localized string for commit message
  await git.init().add(starterFiles).commit('Initial Commit')
}
