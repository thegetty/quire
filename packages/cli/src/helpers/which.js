/**
 * A helper module to wrap the `which` utility
 * @module which
 */
import which from 'which'
import { ToolNotFoundError } from '#src/errors/index.js'

/**
 * A simple wrapper around the `which` utility
 * to find the first instance of an executable in the shell environment PATH
 *
 * @param  {String}  executable  shell executable to find
 * @throws {ToolNotFoundError} When executable is not found in PATH
 */
export default (executable) => {
  const result = which.sync(executable, { nothrow: true })
  if (!result) {
    throw new ToolNotFoundError(executable)
  }
  return result
}
