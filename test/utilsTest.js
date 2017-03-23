const assert = require('assert')
const util = require('../util/util')

describe('Utility functions', function() {
  describe('commandMissing()', function() {
    it('should return false when a command exists', function() {
      assert.equal(util.commandMissing('node'), false)
    })

    it('should return true when a command does not exist', function() {
      assert.equal(util.commandMissing('foo'), true)
    })
  })

  describe('dirIsValidProject()', function() {
    it('should return true when a config.yml file is present')
    it('should return false when a config.yml file is not present')
  })

  describe('themeName()', function() {
    it('should read the value of "theme" property from config.yml and return it')
  })
})
