// Check if a given shell command is missing
//
const exists = require('command-exists').sync

module.exports = function(cmd) {
  return !exists(cmd)
}
