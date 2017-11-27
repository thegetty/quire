const fs = require('fs')
const yaml = require('js-yaml')

function readYAML (file) {
  return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
}

module.exports = { readYAML }
