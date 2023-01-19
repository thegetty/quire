import { execa } from 'execa'
import which from '#helpers/which.js'

/**
 * A façade module for interacting with the Prince CLI.
 * @see https://www.princexml.com/doc/command-line/
 */
export default async (input, output, options = {}) => {
  which('prince')

  /**
   * @see https://www.princexml.com/doc/command-line/#options
   */
  const cmdOptions = [
    `--output=${output}`,
  ]

  if (options.debug) cmdOptions.push('--debug')
  if (options.verbose) cmdOptions.push('--verbose')

  const { stderror, stdout } = await execa('prince', [...cmdOptions, input])
  return { stderror, stdout }
}
