import { execa } from 'execa'
import path from 'node:path'
import paths, { projectRoot } from '#lib/11ty/paths.js'
import which from '#helpers/which.js'

/**
 * A façade module for interacting with Prince XML CLI.
 */
export default async (input, options) => {
  const output = path.join(projectRoot, `prince.pdf`)
  const defaults = [
    `--outline-tags 'h1'`,
    `--output ${output}`,
  ]
  const cmdOptions = Object.assign(defaults, options)
  const { stderror, stdout } = execa('prince', [...cmdOptions, input])
  return { stderror, stdout }
}
