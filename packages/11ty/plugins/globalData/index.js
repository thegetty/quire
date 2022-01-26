const fs = require('fs')
const json5 = require('json5')
const path = require('path')
const toml = require('toml')
const yaml = require('js-yaml')

/**
 * Loads _data files in order to make them available to shortcodes
 */

const dataDir = path.join('content', '_data')
const globalData = {}

function loadData = (filePath) => {
  const { ext } = path.parse(filePath)
  const data = fs.readFileSync(filePath)
  switch (true) {
    case ext === 'geojson':
      return JSON.parse(data)
    case ext === 'json5':
      return json5.parse(data)
    case ext === 'toml':
      return toml.load(data)
    case ext === 'yaml':
      return yaml.load(data)
    default:
      console.warn(`Unsupported data file type ${filePath}`)
      return
  }
}

for (let file of fs.readdirSync(dataDir)) {
  const filePath = path.join(dataDir, file)
  const { name } = path.parse(filePath)
  if (name !== 'eleventyComputed') {
    globalData[name] = loadData(filePath)
  }
}

module.exports = globalData
