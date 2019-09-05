const assert = require('assert')
const path = require('path')
const glob = require('glob')
const tmp = require('tmp')
const fs = require('fs')
const Project = require(path.join('..', 'lib', 'project'))

const defaultLocation = process.cwd()
const validProjectDir = path.join(defaultLocation, 'test', 'fixtures', 'quire-starter')
const invalidProjectDir = path.join(defaultLocation, 'test', 'fixtures', 'no-config-file')

describe('Project', function () {
  let project

  describe('loadConfig', function () {
    afterEach(function () { process.chdir(defaultLocation) })

    it('should successfully read YAML values in config.yml', function () {
      process.chdir(validProjectDir)
      project = new Project()
      project.loadConfig()
      assert.equal(project.config.title, 'Quire Starter')
    })

    it('should throw an error if no config.yml file is present', function () {
      process.chdir(invalidProjectDir)
      assert.throws(() => { project = new Project() }, Error)
    })
  })

  describe('loadBookData', function () {
    it('should successfully read YAML values in publication.yml', function () {
      process.chdir(validProjectDir)
      project = new Project()
      let bookData = project.loadBookData()
      assert.equal(bookData.reading_line, 'A digital publication framework built on Hugo')
    })
  })

  describe('chapters', function () {
    it('should return an array of paths to content files', function () {
      process.chdir(validProjectDir)
      project = new Project()
      let contentDocs = glob.sync(path.join('content', '**', '*.md'))

      assert.equal(project.chapters.length, contentDocs.length)
    })
  })

  describe('getURLforChapter', function () {
    it('should return "localhost:1313/" for the cover page', function () {
      process.chdir(validProjectDir)
      project = new Project()
      let cover = project.chapters[0]
      assert.equal(project.getURLforChapter(cover), 'http://localhost:1313/')
    })

    it('should return the correct URL for section-head files with a slug specified', function () {
      process.chdir(validProjectDir)
      project = new Project()
      let filePath = 'content/catalogue/catalogue-index.md'
      let sectionHead = project.chapters.find(c => { return c === filePath })
      assert.equal(project.getURLforChapter(sectionHead), 'http://localhost:1313/catalogue')
    })

    it('should return URL based on file path for normal chapters', function () {
      process.chdir(validProjectDir)
      project = new Project()
      let filePath = 'content/catalogue/1.md'
      let chapter = project.chapters.find(c => { return c === filePath })
      assert.equal(project.getURLforChapter(chapter), 'http://localhost:1313/catalogue/1')
    })
  })
})
