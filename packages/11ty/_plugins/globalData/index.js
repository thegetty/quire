const fs = require('fs-extra')
const path = require('path')
const pluralize = require('~lib/pluralize')
const yaml = require('js-yaml')
const chalkFactory = require('~lib/chalk')
const { error } = chalkFactory('_plugins:globalData')

/**
 * Throws error if data contains duplicate ids
 * @param  {Object|Array} data
 */
const checkForDuplicateIDs = function(data) {
  if (!data) return
  switch (true) {
    case Array.isArray(data):
      if (data.every((item) => item.hasOwnProperty('id'))) {
        const duplicates = data.filter((a, index) => {
          return data.findIndex((b) => b.id === a.id) !== index
        })
        if (duplicates.length) {
          throw new Error(
            `Found entries with duplicate IDs. ${pluralize(duplicates.length, 'ID')}: ${duplicates.map((item) => item.id).join(', ')}`
          )
        }
      }
      break;
    case typeof data === 'object':
      Object.keys(data).forEach((key) => {
        checkForDuplicateIDs(data[key])
      })
      break;
    default:
      break;
  }
}

module.exports = function(eleventyConfig, options) {
  const dataDirectory = path.join('content', '_data')
  const filenames = fs.readdirSync(dataDirectory)
  filenames.forEach((filename) => {
    const { base, ext, name } = path.parse(filename)
    const filePath = path.join(dataDirectory, filename)

    let data;
    switch(ext) {
      case '.geojson':
      case '.json':
        data = fs.readJsonSync(filePath)
        break;
      case '.yaml':
      case '.yml':
        data = yaml.load(fs.readFileSync(filePath))
        break;
      default:
        return;
    }
    try {
      checkForDuplicateIDs(data)
      eleventyConfig.addGlobalData(name, data)
    } catch(errorMessage) {
      error(`${filename} contains multiple entries with the same ID. IDs must be unique. ${errorMessage}`)
    }
  })
}
