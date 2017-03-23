// Build command
//
const exec = require('child_process').exec
const util = require('../util/util')

module.exports = function() {
  if (util.commandMissing('hugo')) {
    console.log(chalk.yellow('Please install hugo before continuing.'))
    process.exit(1)
  }
  // If not in a project directory, throw an error
  // If in a project directory, run `hugo build` and pass any options
}
