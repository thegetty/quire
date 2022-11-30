import { execa } from 'execa'
import which from '#helpers/which.js'

/**
 * A façade module for interacting with Prince CLI.
 */
export default async (input, output, options) => {
  which('prince')

  const defaults = [
    `--outline-tags 'h1'`,
    `--output ${output}`,
  ]
  const cmdOptions = Object.assign(defaults, options)
  const { stderror, stdout } = execa('prince', [...cmdOptions, input])
  return { stderror, stdout }
}
