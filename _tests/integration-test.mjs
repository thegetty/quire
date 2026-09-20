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
  // Create an unawaited and unblocking preview process so we can mutate content   
  const controller = new AbortController()
  const options = {
    cancelSignal: controller.signal,
    detached: true,
    killDescendants: true,
    stdio: 'ignore',
    windowsHide: true
  }

  // NB: Node docs indicate `unref()` is all necessary, but Circle's executor needs the IPC severed too
  // See https://nodejs.org/api/child_process.html#child_process_options_detached
  const preview = execa('quire', ['preview'], options)
  preview.unref()
  preview.disconnect()

  // Make a trivial file change and check that the preview responds
  const pagePath = 'content/index.md'
  if (!fs.existsSync(pagePath)) {
    t.fail('"quire preview" should be run in a publication directory')
  }

  /**
   * @function waitForPath
   * 
   * @param {String} filepath
   * @param {Number} timeout
   * @param {Number} delay 
   * 
   * Returns a promise that resolves when `filepath` exists, polling every `delay` until `timeout` (all in ms)
   **/ 
  const waitForPath = (filepath, timeout=25000, delay=500) => new Promise((resolve, reject) => {
    let elapsed = 0
    let interval = setInterval(() => {
      if ((() => fs.existsSync(filepath))) {
        clearInterval(interval)
        resolve()
      }

      if (elapsed >= timeout) {
        clearInterval(interval)
        t.fail(`quire preview should generate output within ${timeout}ms`)
        reject()
      }
      elapsed += delay
    }, delay)
  })

  const siteDirectory = path.join(process.cwd(), '_site') 
  const modifiedPagePath = path.join(process.cwd(), '_site', 'index.html')

  await waitForPath(siteDirectory)
  await waitForPath(modifiedPagePath)

  const waitForChange = (filepath, change, timeout=50000, delay=500) => new Promise((resolve, reject) => {
    let elapsed = 0
    
    let interval = setInterval(() => {
      if ((() => fs.existsSync(filepath)) && (() => fs.readFileSync(filepath, { encoding: 'utf8' }).includes(change))) {
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
  fs.appendFileSync(pagePath, `\n${modification}`)

  await waitForChange(modifiedPagePath, modification)

  try {
    setTimeout(async () => {
      controller.abort()
    }, 100)
    await preview

  } catch (error) {
    if (error.isCanceled) {
      // Undo the change so it's not left in later tests and artifacts
      await execa('git', ['checkout', 'content/index.md'])
    } else {
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

test.serial('Create the default publication and build the site, epub, pdf', async (t) => {
  const newCmd = await execa('quire', ['new', '--debug', '--quire-path', eleventyPath, publicationName ])

  process.chdir(publicationName)
  await testPreviewChange(t)
  await buildSitePdfEpub(t)
  process.chdir(repoRoot)
  t.pass()
})

test.serial('Create the default publication with a pathname and build the site, epub, pdf', async (t) => {
  const newCmd = await execa('quire', ['new', '--debug', '--quire-path', eleventyPath, pathedPub ])

  process.chdir(pathedPub)
  changePubUrl(`http://localhost:8080/${ pathedPub }/`, t)

  await testPreviewChange(t)
  await buildSitePdfEpub(t)
  process.chdir(repoRoot)
  t.pass()
})

// Package built site products for artifact storage and stage pathed publication
test.after(async (t) => {
  await execa('zip', ['-r', publicationZip, path.join(publicationPath, '_site'), path.join(publicationPath, '_epub'), path.join(publicationPath, 'epubjs.epub')])
})