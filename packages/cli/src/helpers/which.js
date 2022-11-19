import which from 'which'

/**
 * A simple wrapper around the `which` utility
 * to find the first instance of an executable in the shell environment PATH
 *
 * @param  {String}  executable  shell executable to find
 */
export default (executable) => {
  const result = which.sync(executable, { nothrow: true })
  if (!result) {
    console.error(`Unable to locate executable '${executable}'\n
      Ensure that the '${executable}' executable is installed and available in the shell environment PATH.
    `)
  }
  return result
}
