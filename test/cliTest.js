const assert = require('assert')
const path = require('path')
const CLI = require(path.join('..', 'lib', 'cli'))

const defaultLocation = process.cwd()
const validProjectDir = path.join(defaultLocation, 'test', 'fixtures', 'has-config-file')
const invalidProjectDir = path.join(defaultLocation, 'test', 'fixtures', 'no-config-file')

describe('CLI', function () {
  let quire

  describe('commandMissing', function () {
    // Set up a new instance for each assertion
    beforeEach(function () { quire = new CLI() })

    it('should return true when a command does not exist', function () {
      assert.equal(quire.commandMissing('foo'), true)
    })

    it('should return false when a command does exist', function () {
      assert.equal(quire.commandMissing('node'), false)
    })
  })

  describe('isValidProject', function () {
    // Return to the default location after each assertion
    afterEach(function () { process.chdir(defaultLocation) })

    it('should return false when the project folder lacks a config.yml file', function () {
      process.chdir(invalidProjectDir)
      quire = new CLI()
      assert.equal(quire.isValidProject(), false)
    })

    it('should return true when the project folder has a config.yml file', function () {
      process.chdir(validProjectDir)
      quire = new CLI()
      assert.equal(quire.isValidProject(), true)
    })
  })

  describe('preflight', function () {
    // Return to the default location after each assertion
    afterEach(function () { process.chdir(defaultLocation) })

    it('should raise an error in an invalid project folder.', function () {
      process.chdir(invalidProjectDir)
      quire = new CLI()
      assert.throws(quire.preflight, Error)
    })

    it('should read the contents of config.yml in a valid project folder.', function () {
      process.chdir(validProjectDir)
      quire = new CLI()
      assert.equal(quire.preflight().name, 'hemingway')
    })
  })

  describe('preview', function () {
    afterEach(function () {
      quire.emit('shutdown')
      process.chdir(defaultLocation)
    })

    it('should raise an error in an invalid project folder.', function () {
      process.chdir(invalidProjectDir)
      quire = new CLI()
      assert.throws(quire.preview, Error)
    })

    it('should spawn child processes for `hugo` and `webpack`', function () {
      process.chdir(validProjectDir)
      quire = new CLI()
      quire.preview()
      assert('hugo' in quire)
      assert('webpack' in quire)
    })
  })

  describe('build', function () {
    afterEach(function () {
      quire.emit('shutdown')
      process.chdir(defaultLocation)
    })

    it('should raise an error in an invalid project folder.', function () {
      process.chdir(invalidProjectDir)
      quire = new CLI()
      assert.throws(quire.build, Error)
    })

    it('should pick up the output dir if user has specified a custom folder')
    it('should raise an error if the site does not build successfully')
  })
})
