import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import path from 'node:path'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const normalizedPath = path.join(__dirname, './');

// const commands = fs
//   .readdirSync(normalizedPath)
//   .filter((file) => file.match(/[a-zA-Z]+Command.js/))
//   .map(async (file) => {
//     const Command = await import('./' + file).then((command) => command)
//     console.log('command is', Command)
//     return new Command()
//   })

import Build from './build.js'

export const build = new Build()
