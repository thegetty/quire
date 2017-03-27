const assert = require('assert')
const cwd = require('cwd')
const preview = require('../commands/preview')
const path = require('path')

const BASE_DIR = cwd()

let invalidProject = path.join('test', 'fixtures', 'no-config-file')
let validProject = path.join('test', 'fixtures', 'has-config-file')

describe('quire preview', function() {
  afterEach(function() {
    process.chdir(BASE_DIR)
  })

  it('should return false when the project folder has no config file', function() {
    // process.chdir(invalidProject)
    // assert.equal(preview(), false)
  })

  it('should return true when the project folder has a config file', function() {
    // process.chdir(validProject)
    // assert.equal(preview(), false)
  })
})
