const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

const loadData = (fileName) => {
  const filePath = path.join('content', '_data', fileName)
  return yaml.load(fs.readFileSync(filePath))
}

const config = loadData('config.yaml')
const figures = loadData('figures.yaml')
const objects = loadData('objects.yaml')
const publication = loadData('publication.yaml')
const references = loadData('references.yaml')

module.exports = { config, figures, objects, publication, references }
