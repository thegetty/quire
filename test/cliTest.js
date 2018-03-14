const assert = require('assert')
const path = require('path')
const tmp = require('tmp')
const fs = require('fs')
const CLI = require(path.join('..', 'lib', 'cli'))

const defaultLocation = process.cwd()
const validProjectDir = path.join(defaultLocation, 'test', 'fixtures', 'has-config-file')
const invalidProjectDir = path.join(defaultLocation, 'test', 'fixtures', 'no-config-file')

describe('CLI', function () {
  let quire

  describe('create', function () {
    // Return to the default location after each assertion
    afterEach(function () { process.chdir(defaultLocation) })

    it('should successfully create a starter project', function () {
      let sandboxDir = tmp.dirSync({ unsafeCleanup: true })
      let projectName = 'testProject'

      process.chdir(sandboxDir.name)
      quire = new CLI()
      quire.create(projectName).then(() => {
        assert.equal(fs.existsSync(projectName), true)
      })
    })

    it('should successfully create a theme subdirectory in the new project', function () {
      let sandboxDir = tmp.dirSync({ unsafeCleanup: true })
      let projectName = 'testProject'
      let projectThemePath = path.join(projectName, 'themes', 'quire-starter-theme')

      process.chdir(sandboxDir.name)
      quire = new CLI()
      quire.create(projectName).then(() => {
        assert.equal(fs.existsSync(projectThemePath), true)
      })
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
  })

  describe('verbose', function () {
    afterEach(function () {
      quire.emit('shutdown')
      process.chdir(defaultLocation)
    })

    it('should set verbose to true.', function () {
      quire = new CLI()
      quire.verbose = true
      assert.equal(quire.verbose, true)
    })
  })
})
