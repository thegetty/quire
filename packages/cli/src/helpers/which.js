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
 * @param  {Object}  [toolInfo]  optional metadata for error messages
 * @param  {String}  [toolInfo.displayName]  human-readable tool name
 * @param  {String}  [toolInfo.installUrl]  URL where tool can be downloaded
 * @param  {String}  [toolInfo.docsUrl]  Quire docs URL for this tool
 * @param  {String}  [toolInfo.fallback]  alternative suggestion
 * @throws {ToolNotFoundError} When executable is not found in PATH
 * @returns {String} Path to the executable
 */
export default (executable, toolInfo) => {
  const result = which.sync(executable, { nothrow: true })
  if (!result) {
    throw new ToolNotFoundError(executable, toolInfo)
  }
  return result
}
