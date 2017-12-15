const fs = require('fs')
const exists = require('command-exists').sync
const yaml = require('js-yaml')

function readYAML (file) {
  let doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'))
  return doc
}

function commandMissing (command) {
  return !exists(command)
}

module.exports = {
  commandMissing,
  readYAML
}
