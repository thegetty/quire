/**
 * integration-test.mjs
 * 
 * Integration tests for quire-cli + quire-11ty + quire-starter-default.
 * 
 * This script tests a few things in a specific order:
 *  - Already-installed quire-cli must create a new publication with this repo's quire-11ty
 *  - Publication must build successfully
 *  - Built publication must test functionally correctly in a browser (see publication-cover.spec.js, here)
 *  - PDF must build successfully
 *  - epub must build successfully
 * 
 **/ 

import fs from 'node:fs'
import { execa } from 'execa'
import path from 'node:path'
import yaml from 'js-yaml'
import test from 'ava'

const publicationName = 'test-publication'
const pathedPub = `${publicationName}-pathname`

const repoRoot = process.cwd()
const eleventyPath = path.join( process.cwd() , 'packages', '11ty' )
const publicationPath = path.join( process.cwd(), publicationName )
const publicationZip = path.join( process.cwd(), 'publication.zip' )

/**
 * @function changePubUrl
 * 
 * @param {String} url URL to use in YAML
 * @param {test} t ava test object
 * 
 * Modifies publication YAML file to change publication url
 **/ 
const changePubUrl = (url, t) => {
  const publicationYaml = 'content/_data/publication.yaml'

  if (!fs.existsSync(publicationYaml)) t.fail()
  
  const data = fs.readFileSync(publicationYaml)
  let publication = yaml.load(data)

  publication.url = url

  fs.writeFileSync(publicationYaml, yaml.dump(publication))
}

/**
 * @function testPreviewChange
 * 
 * @param {ava:test} t
 * 
 * Previews the publication and tests that it successfully responds to file changes
 *
 **/ 
const testPreviewChange = async (t) => {
  // TODO: Check both --11ty api and --11ty cli

  // Create an unawaited and unblocking preview process
  const controller = new AbortController()
  const options = {
    cancelSignal: controller.signal,
    killDescendants: true,
    reject: false,
    stdout: { file: 'preview.txt' },
    windowsHide: true
  }

  const preview = execa('quire', ['preview'], options)

  // Make a trivial file change and check that the preview responds
  const pagePath = 'content/index.md'
  if (!fs.existsSync(pagePath)) {
    t.fail('"quire preview" should be run in a publication directory')
  }

  const modifiedPagePath = path.join(process.cwd(), '_site', 'index.html')

  /**
   * @function watchStarted
   * 
   * @param {Number} timeout Length of time to wait before failing the test
   * @param {Number} delay Time to delay between stdout polling cycles
   * 
   * Promise that resolves when the preview watch has started, polling the stdout file every `delay` until `timeout` (all in ms)
   * 
   * TODO: Pass a passthrough stream to the execa handle, read from it instead of file 
   **/ 
  const watchStarted = (timeout=60000, delay=500) => new Promise((resolve, reject) => {
    let elapsed = 0
    let interval = setInterval(() => {
      const content = fs.readFileSync('preview.txt', { encoding: 'utf8' })
      if (elapsed >= timeout) {
        t.fail("quire preview did not start within the timeout window")
        reject()
      }

      if (content.includes('[11ty] Server at')) {
        clearInterval(interval)
        resolve()
      }

      elapsed += delay
    }, delay)
  })
  await watchStarted()

  const waitForChange = (filepath, change, timeout=100000, delay=500) => new Promise((resolve, reject) => {
    let elapsed = 0
    
    let interval = setInterval(() => {
      const contents = fs.existsSync(filepath) ? fs.readFileSync(filepath, { encoding: 'utf8' }) : ''
      if (contents.includes(change)) {
        clearInterval(interval)
        resolve()
      }

      if (elapsed >= timeout) {
        clearInterval(interval)
        t.fail(`quire preview should regenerate changes within ${timeout}ms`)
        reject()
      }
      elapsed += delay
    }, delay)
  })

  // Modify the file, inserting a datestamp for debugging and uniqueness
  // NB: Test mutation should be short so not line broken by markdown render
  const modification = `A test sentence, timestamp ${Date.now()}.`
  fs.appendFileSync(pagePath, `\n${modification}`, 'utf8')

  await waitForChange(modifiedPagePath, modification)

  try {
    controller.abort()

  } catch (error) {
    if (!error.isCanceled) {
      t.fail(`quire preview subprocess should gracefully exit when aborted ${error}`)    
    }
  }

  t.pass('quire preview should propagate page changes')
}

/**
 * @function buildSitePdfEpub
 * 
 * @param {ava:test} t
 * 
 * Builds a quire site, its pdf and epub.
 * 
 **/ 
const buildSitePdfEpub = async (t) => {
  const {stdout: buildStdout, stderr: buildStderr } = await execa('quire', ['build'])
  const {stdout: pdfStdout, stderr: pdfStderr} = await execa('quire', ['pdf'])
  const {stdout: epubStdout, stderr: epubStderr} = await execa('quire', ['epub'])

  const downloadsDir = path.join('_site', '_assets', 'downloads')
  const publicationPdf = path.join(downloadsDir, 'publication.pdf')
  if (!fs.existsSync(publicationPdf)) {
    t.fail(`No publication PDF generated! ${buildStdout} ${buildStderr}`)
  }

  const essayPdf = path.join(downloadsDir, 'publication-essay.pdf')
  if (!fs.existsSync(essayPdf)) {
    t.fail(`No essay PDF generated! ${pdfStdout} ${pdfStderr}`)
  }

  const epubDir = '_epub'
  if (!fs.existsSync(epubDir)) {
    t.fail(`No epub assets generated! ${stdout} ${stderr}`)
  }

  const epubFile = 'epubjs.epub'
  if (!fs.existsSync(epubFile)) {
    t.fail(`No epub file generated! ${epubStdout} ${epubStderr}`)
  }
}

test.serial('Create the default publication', async (t) => {
  const newCmd = await execa('quire', ['new', '--debug', '--quire-path', eleventyPath, publicationName ])

  t.pass()
})

test.serial('Preview the default publication and respond to changes', async (t) => {
  process.chdir(publicationName)
  await testPreviewChange(t)
  await execa('quire', ['clean'])
  
  process.chdir(repoRoot)

  t.pass()
})

test.serial('Build the default publication, pdf, and epub', async (t) => {
  process.chdir(publicationName)
  await buildSitePdfEpub(t)
  process.chdir(repoRoot)

  t.pass()
})

test.serial('Create the default publication with a pathname', async (t) => {
  const newCmd = await execa('quire', ['new', '--debug', '--quire-path', eleventyPath, pathedPub ])

  process.chdir(pathedPub)
  changePubUrl(`http://localhost:8080/${ pathedPub }/`, t)

  process.chdir(repoRoot)

  t.pass()
})

test.serial('Preview the pathed publication and respond to changes', async (t) => {
  process.chdir(pathedPub)

  await testPreviewChange(t)
  await execa('quire', ['clean'])

  process.chdir(repoRoot)

  t.pass()
})

test.serial('Build the pathed publication site, epub, and pdf', async (t) => {
  process.chdir(pathedPub)

  await buildSitePdfEpub(t)
  process.chdir(repoRoot)

  t.pass()
})

// Package built site products for artifact storage and stage pathed publication
test.after(async (t) => {
  await execa('zip', ['-r', publicationZip, path.join(publicationPath, '_site'), path.join(publicationPath, '_epub'), path.join(publicationPath, 'epubjs.epub')])
})