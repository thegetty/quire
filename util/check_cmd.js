// Check if a given shell command exists
//
const exists = require('command-exists').sync

module.exports = function(cmd) {
  return exists(cmd)
}
