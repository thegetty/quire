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
  // Create an unawaited and unblocking preview process
  const controller = new AbortController()

  const options = {
    cancelSignal: controller.signal,
    killDescendants: true,
    reject: false,
    windowsHide: true
  }
  const preview = execa('quire', ['preview'], options)
  preview.stdout.setEncoding('utf8')

  // Make a trivial file change and check that the preview responds
  const pagePath = 'content/index.md'
  if (!fs.existsSync(pagePath)) {
    t.fail('"quire preview" should be run in a publication directory')
  }

  // NB: Test mutation should be short so not line broken by markdown render
  const modification = `A test sentence, timestamp ${Date.now()}.`
  const modifiedPagePath = path.join(process.cwd(), '_site', 'index.html')

  // Read lines until the server launch logline, make a change, wait for the vite copy
  let buffer = ''
  let started, rebuilt = false
  for await (const chunk of preview.stdout) {
    buffer += chunk

    switch (true) {
      case !started && buffer.includes('[11ty] Server at'): {
        buffer = ''
        started = true

        // Modify the file, inserting a datestamp for debugging and uniqueness
        fs.appendFileSync(pagePath, `\n${modification}`, 'utf8')

        break
      }

      case started && buffer.includes('[11ty] Copied'): {
        rebuilt = true
        break
      }
      default:
        break
    }

    if (rebuilt) break
  }

  const contents = fs.readFileSync(modifiedPagePath, { encoding: 'utf8' })
  if (!contents.includes(modification)) {
    t.fail('rebuilt site during preview should include change')
  }

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
 * @function buildSite
 * 
 * @param {ava:test} t
 * 
 * Runs `quire build` and verifies correct output
 * 
 **/ 
const buildSite = async (t) => {
  const { stdout, stderr } = await execa('quire', ['build'])

  const coverFile = path.join('_site','index.html')
  if (!fs.existsSync(coverFile)) {
    t.fail("build should generate a cover HTML file")
  }
}

/**
 * @function makePdf
 * 
 * @param {ava:test} t
 * 
 * Runs `quire pdf` and verifies correct output
 * 
 **/
const makePdf = async (t) => {
  const { stdout, stderr } = await execa('quire', ['pdf'])

  const downloadsDir = path.join('_site', '_assets', 'downloads')
  const publicationPdf = path.join(downloadsDir, 'publication.pdf')
  if (!fs.existsSync(publicationPdf)) {
    t.fail("publication should have a full PDF")
  }

  const essayPdf = path.join(downloadsDir, 'publication-essay.pdf')
  if (!fs.existsSync(essayPdf)) {
    t.fail("publication should have an essay-only PDF")
  }
}

/**
 * @function makeEpub
 * 
 * @param {ava:test} t
 * 
 * Runs `quire epub` and verifies correct output
 * 
 **/
const makeEpub = async (t) => {
  const { stdout, stderr } = await execa('quire', ['epub'])

  const epubDir = '_epub'
  if (!fs.existsSync(epubDir)) {
    t.fail("epub assets directory should exist")
  }

  const epubFile = 'epubjs.epub'
  if (!fs.existsSync(epubFile)) {
    t.fail("generated epub should exist")
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

test.serial('Build the default publication site', async (t) => {
  process.chdir(publicationName)
  await buildSite(t)
  process.chdir(repoRoot)

  t.pass()
})

test.serial('Build the default publication pdf', async (t) => {
  process.chdir(publicationName)
  await makePdf(t)
  process.chdir(repoRoot)

  t.pass()
})

test.serial('Build the default publication epub', async (t) => {
  process.chdir(publicationName)
  await makeEpub(t)
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

test.serial('Build the pathed publication site', async (t) => {
  process.chdir(pathedPub)

  await buildSite(t)
  process.chdir(repoRoot)

  t.pass()
})

test.serial('Build the pathed publication pdf', async (t) => {
  process.chdir(pathedPub)

  await makePdf(t)
  process.chdir(repoRoot)

  t.pass()
})

test.serial('Build the pathed publication epub', async (t) => {
  process.chdir(pathedPub)

  await makeEpub(t)
  process.chdir(repoRoot)

  t.pass()
})

// Package built site products for artifact storage and stage pathed publication
test.after(async (t) => {
  await execa('zip', ['-r', publicationZip, path.join(publicationPath, '_site'), path.join(publicationPath, '_epub'), path.join(publicationPath, 'epubjs.epub')])
})