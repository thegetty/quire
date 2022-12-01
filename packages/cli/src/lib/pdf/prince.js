import { execa } from 'execa'
import which from '#helpers/which.js'

/**
 * A façade module for interacting with Prince CLI.
 */
export default async (input, output, options = {}) => {
  which('prince')

  const cmdOptions = [
    `--output=${output}`,
  ]

  const { stderror, stdout } = await execa('prince', [...cmdOptions, input])
  return { stderror, stdout }
}
