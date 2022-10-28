import fs from 'fs-extra'
import path from 'path'
import { cwd } from 'node:process'
/**
 * Clone or copy a Quire starter project
 *
 * @param    {String}   starter   A repository URL or path to local starter
 * @param    {String}   rootPath  Absolute system path to the project root
 * @return   {Promise}
 */
export async function initStarter (starter, rootPath) {
  const fullStarterPath = path.resolve(starter)
  const fullRootPath = path.resolve(rootPath)
  const starterFiles = fs.readdirSync(fullStarterPath)
  // copies all files in `starters/default`, including `.gitignore`, `CHANGELOG,md`, `README.md`, `content`
  starterFiles.forEach((filePath) => {
    const fileToCopy = path.resolve(fullStarterPath, filePath)
    fs.copySync(fileToCopy, path.join(fullRootPath, path.basename(filePath)))
  })

  const eleventyPath = path.resolve(cwd(), '../11ty')
  const eleventyFiles = fs
    .readdirSync(eleventyPath)
    .filter((filePath) => {
      const ignoreFiles = ['content', 'node_modules', '_site']
      return !ignoreFiles.includes(filePath)
    })

  /**
   * Reads .gitignore and .eleventyignore to generate a list of file names to ignore
   * @TODO handle `*` splat entries e.g. `**\/*\/.DS_Store'`
   */
  const getIgnoredFiles = () => {
    return ['.gitignore', '.eleventyignore']
      .flatMap((ignoreFile) => {
        return fs
          .readFileSync(path.join(eleventyPath, ignoreFile), 'UTF-8')
          .split(/\r?\n/)
          .filter((line) => !line.startsWith('#') && line.length > 0)
      })
  }

  const eleventyFilesToIgnore = [
    'content',
    ...getIgnoredFiles()
  ]

  // copies all files in `quire/packages/11ty`, except for ignored files
  eleventyFiles.forEach((filePath) => {
    const fileToCopy = path.resolve(eleventyPath, filePath)
    if (!eleventyFilesToIgnore.includes(filePath)) {
      fs.copySync(fileToCopy, path.join(fullRootPath, path.basename(filePath)))
    }
  })
  // @TODO use `execa` to install node_modules
}
