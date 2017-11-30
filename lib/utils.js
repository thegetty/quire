const fs = require('fs')
const exists = require('command-exists').sync
const yaml = require('js-yaml')

function readYAML (file) {
  return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
}

function commandMissing (command) {
  return !exists(command)
}

module.exports = {
  commandMissing,
  readYAML
}
