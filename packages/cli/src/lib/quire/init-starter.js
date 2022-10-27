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
  const eleventyFiles = fs.readdirSync(eleventyPath)
  // copies all files in `quire/packages/11ty`
  eleventyFiles.forEach((filePath) => {
    const fileToCopy = path.resolve(eleventyPath, filePath)
    fs.copySync(fileToCopy, path.join(fullRootPath, path.basename(filePath)))
  })
  // @TODO don't copy node modules. skip them, then use `execa` to install
}
