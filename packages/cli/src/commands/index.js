import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Dynamically import command modules in parallel
 * and call the class constuctor for each command
 */
const commands = await Promise.all(
  fs.readdirSync(__dirname)
    .filter((file) => file.match(/^(?!index).*\.js$/))
    .map((file) => import(path.resolve(__dirname, file)))
).then((modules) => {
  return modules.map(({ default: command }) => new command())
})

export default commands
