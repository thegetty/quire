const assert = require('assert')
const commandMissing = require('../util/cmd_missing')

describe('check command util', function() {
  it('should return false when a command exists', function() {
    assert.equal(commandMissing('node'), false)
  })

  it('should return true when a command does not exist', function() {
    assert.equal(commandMissing('foo'), true)
  })
})
