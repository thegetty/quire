import isQuire from '#helpers/is-quire.js'

/**
 * Test current working directory is a Quire project directory
 *
 * @param  {Command}  command  the command from which testcwd was called
 */
export default (command) => {
  const message = `[CLI] ${ command ? command.name() : '' } command must be run while in a Quire project directory. Use 'cd' to navigate to your project directory and re-run the 'quire ${ command ? command.name() : '' }' command.`

  if (!isQuire(process.cwd())) {
    console.error(message)
    process.exit(1)
  }
}
