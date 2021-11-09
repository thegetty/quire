const fs   = require('fs')
const yaml = require('js-yaml')

const config = yaml.load(fs.readFileSync('./src/_data/config.yaml'))
const figures = yaml.load(fs.readFileSync('./src/_data/figures.yaml'))
const objects = yaml.load(fs.readFileSync('./src/_data/objects.yaml'))
const publication = yaml.load(fs.readFileSync('./src/_data/publication.yaml'))
const references = yaml.load(fs.readFileSync('./src/_data/references.yaml'))

module.exports = { config, figures, objects, publication, references }