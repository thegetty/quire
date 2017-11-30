const assert = require('assert')
const path = require('path')
const { commandMissing, readYAML } = require(path.join('..', 'lib', 'utils'))

describe('utils', function () {
  describe('readYAML', function () {
    it('should return the contents of a yaml file as an object', function () {
      let filePath = path.join(__dirname, 'fixtures', 'has-config-file', 'config.yml')
      let yaml = readYAML(filePath)
      assert.equal(yaml.baseurl, 'http://yoursite.example.com/')
    })
  })

  describe('commandMissing', function () {
    it('should return true when a command does not exist', function () {
      assert.equal(commandMissing('foo'), true)
    })

    it('should return false when a command does exist', function () {
      assert.equal(commandMissing('node'), false)
    })
  })

})
