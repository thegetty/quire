import { dynamicImport } from '#helpers/os-utils.js'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const thisfile = path.basename(__filename)

/**
 * Filter out files that are not command modules
 * @param directory entry 
 * @returns Boolean 
 */
const filterEntries = (entry) => entry !== thisfile && entry.match(/^.*(?<!spec|test)\.js$/)

/**
 * Dynamically import command modules in parallel
 * and call the class constuctor for each command
 */
const commands = await Promise.all(
  fs.readdirSync(__dirname)
    .filter((entry) => filterEntries(entry))
    .map(async (entry) => await dynamicImport(path.resolve(__dirname, entry)))
).then((modules) => {
  return modules.map(({ default: CommandClass }) => new CommandClass())
})

export default commands
