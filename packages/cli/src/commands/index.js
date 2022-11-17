import Command from '#src/Command.js'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const thisfile = path.basename(__filename)

// const isCommandModule = async (moduleData) => {
//   return moduleData && moduleData.default
//     && moduleData.default.prototype instanceof Command
// }

/**
 * Recursively imoprt modules from the given directory path
 *
 * @todo only create `CommandClass` when there is no `index.js`
 *
 * @param      {String}  dir    Directory from which to import command modules
 * @return     {Promise}
 */
async function importCommandModules (dir) {
  console.log('importCommandModules', dir)
  const modules = await Promise.all(
    fs.readdirSync(dir, { withFileTypes: false })
      .map(async (entry) => {
        const filePath = path.join(dir, entry)
        console.debug('entry', filePath)
        const stat = fs.lstatSync(filePath)
        if (stat.isDirectory()) {
          const CommandClass = { definition: { name: entry }}
          CommandClass.prototype = Command
          const subcommands = []
          // const subcommands = await Promise.all(
          //   await importCommandModules(filePath).then((subcommands) => subcommands)
          // )
          try {
            const dirModules = await importCommandModules(filePath)
            subcommands.push(dirModules)
            console.debug('subcommands', subcommands)
          } catch (error) {
            console.error(error)
          }
          return [ CommandClass, subcommands ]
        } else if (entry.match(/^.*\.js$/) && entry !== thisfile) {
          // try {
            const commandModule = await import(filePath)
            // .catch((error) => {
            //   throw new Error(error)
            // })
            return { command: entry, commandModule }
          // } catch (error) {
          //   console.error(`Unable to load command module ${entry}`, error)
          // }
        }
      })
  )
  return modules
}

// async function importCommandModules (dirPath) {
//   const entries = fs.readdirSync(dirPath, { withFileTypes: true })
//   for (const entry of entries) {
//     console.debug(entry)
//     // if (entry.isDirectory()) {
//     //   await importCommandModules(path.join(dirPath, entry.name))
//     // } else {
//     //   // return path.join(dirPath, entry.name)
//     // }
//   }
// }

/**
 * Dynamically import command modules in parallel
 * and call the class constuctor for each command
 */
const commands = await importCommandModules(__dirname).then((modules) => {
  console.debug(modules)
  // modules.map(({ default: CommandClass }) => new CommandClass())
})

export default commands
