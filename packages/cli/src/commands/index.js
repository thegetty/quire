// import { fileURLToPath } from 'node:url'
// import fs from 'fs-extra'
// import path from 'node:path'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const commands = fs
//   .readdirSync(__dirname)
//   .filter((file) => file.match(/^(?!index).*\.js$/))
//   .map(async (file) => {
//     const moduleName = path.resolve(__dirname, file)
//     const command =
//       await import(moduleName).then((moduleExports) => moduleExports.default)
//     return new command()
//   })

import BuildCommand from './build.js'
import CreateCommand from './create.js'

export const build = new BuildCommand()
export const create = new CreateCommand()
