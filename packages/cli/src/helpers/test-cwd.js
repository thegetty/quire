/**
 * A helper module to test the current working directory
 * @module test-cwd
 */
import { detect as isQuire } from '#lib/project/index.js'
import { NotInProjectError } from '#src/errors/index.js'

/**
 * Test current working directory is a Quire project directory
 *
 * @param  {Command}  command  the command from which testcwd was called
 * @throws {NotInProjectError} if not in a Quire project directory
 */
export default (command) => {
  if (!isQuire(process.cwd())) {
    throw new NotInProjectError(command?.name() || '')
  }
}
