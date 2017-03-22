const assert = require('assert')
const checkCmd = require('../util/check_cmd')

describe('check command util', function() {
  it('should return true when a command exists', function() {
    assert.equal(checkCmd('node'), true)
  })

  it('should return false when a command does not exist', function() {
    assert.equal(checkCmd('foo'), false)
  })
})
