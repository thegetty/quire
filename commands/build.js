// Build command
//
const exists = require('command-exists')
const exec = require('child_process').exec

module.exports = function() {
  console.log("Building!")
  // If 'hugo' command not found, throw an error, tell user to install hugo
  // If not in a project directory, throw an error
  // If in a project directory, run `hugo build` and pass any options
}
