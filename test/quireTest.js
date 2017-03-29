const assert = require('assert')
const path = require('path')
const QuireCLI = require(path.join(__dirname, '..', 'lib', 'quire'))

const defaultLocation = process.cwd()
const validProjectDir = path.join(defaultLocation, 'test', 'fixtures', 'has-config-file')
const invalidProjectDir = path.join(defaultLocation, 'test', 'fixtures', 'no-config-file')

describe('QuireCLI', function() {
  let quire

  describe('_commandMissing()', function() {
    beforeEach(function() {
      quire = new QuireCLI()
    })

    it('should return true when a command does not exist', function() {
      assert.equal(quire._commandMissing('foo'), true)
    })

    it('should return false when a command does exist', function() {
      assert.equal(quire._commandMissing('node'), false)
    })
  })

  describe('_isValidProject()', function() {
    afterEach(function() {
      process.chdir(defaultLocation)
    })

    it('should return false when the project folder lacks a config.yml file', function() {
      process.chdir(invalidProjectDir)
      quire = new QuireCLI()
      assert.equal(quire._isValidProject(), false)
    })

    it('should return true when the project folder has a config.yml file', function() {
      process.chdir(validProjectDir)
      quire = new QuireCLI()
      assert.equal(quire._isValidProject(), true)
    })
  })

  describe('_readYAML()', function() {
    it('should return the contents of a yaml file as an object', function() {
      quire = new QuireCLI()
      let filePath = path.join(__dirname, 'fixtures', 'has-config-file', 'config.yml')
      let yaml = quire._readYAML(filePath)
      assert.equal(yaml.baseurl, 'http://yoursite.example.com/')
    })
  })

  describe('_preflight()', function() {
    afterEach(function() {
      process.chdir(defaultLocation)
    })

    it('should raise an error in an invalid project folder.', function() {
      process.chdir(invalidProjectDir)
      quire = new QuireCLI()
      assert.throws(quire._preflight, Error)
    })

    it('should read the contents of config.yml in a valid project folder.', function() {
      process.chdir(validProjectDir)
      quire = new QuireCLI()
      assert.equal(quire._preflight().name, 'hemingway')
    })
  })

  describe('preview()', function() {
    afterEach(function() {
      quire.emit('shutdown')
      process.chdir(defaultLocation)
    })

    it('should raise an error in an invalid project folder.', function() {
      process.chdir(invalidProjectDir)
      quire = new QuireCLI()
      assert.throws(quire.preview, Error)
    })

    it('should spawn child processes for `hugo` and `webpack`', function() {
      process.chdir(validProjectDir)
      quire = new QuireCLI()
      quire.preview()
      assert('hugo' in quire)
      assert('webpack' in quire)
    })
  })

  describe('build()', function() {
    afterEach(function() {
      quire.emit('shutdown')
      process.chdir(defaultLocation)
    })

    it('should raise an error in an invalid project folder.', function() {
      process.chdir(invalidProjectDir)
      quire = new QuireCLI()
      assert.throws(quire.build, Error)
    })

    it('should pick up the output dir if user has specified a custom folder')
    it('should raise an error if the site does not build successfully')
  })
})
