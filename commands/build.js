// Build command
//
const commandMissing = require('../util/cmd_missing')
const exec = require('child_process').exec

module.exports = function() {
  if (commandMissing('hugo')) {
    console.log(chalk.yellow('Please install hugo before continuing.'))
    process.exit(1)
  }
  // If not in a project directory, throw an error
  // If in a project directory, run `hugo build` and pass any options
}
