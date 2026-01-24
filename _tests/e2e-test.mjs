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
 * Environment variables:
 *  - E2E_VARIANT: Controls which tests to run
 *    - 'root': Only run root publication test (no pathname)
 *    - 'pathname': Only run pathname publication test
 *    - 'all' or unset: Run both tests (default)
 *
 **/

import fs from 'node:fs'
import { execa } from 'execa'
import path from 'node:path'
import yaml from 'js-yaml'
import test from 'ava'

/**
 * E2E test variant - controls which publication tests to run
 * Used for parallelizing Windows CI where e2e tests are slow
 */
const VALID_VARIANTS = ['all', 'root', 'pathname']
const variant = process.env.E2E_VARIANT || 'all'

if (!VALID_VARIANTS.includes(variant)) {
  throw new Error(
    `Invalid E2E_VARIANT: '${variant}'. Valid values: ${VALID_VARIANTS.join(', ')}`
  )
}

const runRoot = variant === 'all' || variant === 'root'
const runPathname = variant === 'all' || variant === 'pathname'

/**
 * Sanitize a string for safe inclusion in XML/TAP output;
 * removes ANSI escape codes and replaces control characters.
 *
 * Nota bene: Errors thrown by Puppeteer/Chrome may contain escape codes and/or
 * control characters that must be removed before inclusion in XML output.
 */
const sanitizeForXml = (str) => {
  if (!str) return ''
  return str
    // Remove ANSI escape codes
    .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '')
    // Replace control characters (except newline/tab) with spaces
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
    // Truncate to reasonable length
    .slice(0, 2000)
}

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
    t.fail(`No publication PDF generated! ${sanitizeForXml(buildStdout)} ${sanitizeForXml(buildStderr)}`)
  }

  const essayPdf = path.join(downloadsDir, 'publication-essay.pdf')
  if (!fs.existsSync(essayPdf)) {
    t.fail(`No essay PDF generated! ${sanitizeForXml(pdfStdout)} ${sanitizeForXml(pdfStderr)}`)
  }

  const epubDir = '_epub'
  if (!fs.existsSync(epubDir)) {
    t.fail(`No epub assets generated! ${sanitizeForXml(epubStdout)} ${sanitizeForXml(epubStderr)}`)
  }

  const epubFile = 'epubjs.epub'
  if (!fs.existsSync(epubFile)) {
    t.fail(`No epub file generated! ${sanitizeForXml(epubStdout)} ${sanitizeForXml(epubStderr)}`)
  }
}

test.before('Mirror user package environment.', (t) => {
  // Remove lockfile to ensure dependency resolution runs as from npm package
  const lockfile = path.join('packages', '11ty', 'package-lock.json')
  if (fs.existsSync(lockfile)) {
    fs.rmSync(lockfile)
  }
})

test.serial('Confirm quire-cli is installed and accessible', async (t) => {
  const {stdout, stderr} = await execa('quire', ['--version'])
  console.log('quire version:', stdout)
  t.truthy(stdout, 'quire --version should return output')
  t.pass()
})

test.serial('Create the default publication and build the site, epub, pdf', async (t) => {
  if (!runRoot) {
    t.log('Skipping root publication test (E2E_VARIANT=%s)', variant)
    return t.pass()
  }

  const newCmd = await execa('quire', ['new', '--debug', '--quire-path', eleventyPath, publicationName ])

  process.chdir(publicationName)
  await buildSitePdfEpub(t)
  process.chdir(repoRoot)
  t.pass()
})

test.serial('Create the default publication with a pathname and build the site, epub, pdf', async (t) => {
  if (!runPathname) {
    t.log('Skipping pathname publication test (E2E_VARIANT=%s)', variant)
    return t.pass()
  }

  const newCmd = await execa('quire', ['new', '--debug', '--quire-path', eleventyPath, pathedPub ])

  process.chdir(pathedPub)
  changePubUrl(`http://localhost:8080/${ pathedPub }/`, t)

  await buildSitePdfEpub(t)
  process.chdir(repoRoot)
  t.pass()
})

// Package built site products for artifact storage
test.after(async (t) => {
  const zipArgs = ['-r', publicationZip]

  // Only include directories that were built based on variant
  if (runRoot && fs.existsSync(publicationPath)) {
    zipArgs.push(
      path.join(publicationPath, '_site'),
      path.join(publicationPath, '_epub'),
      path.join(publicationPath, 'epubjs.epub')
    )
  }

  const pathedPubPath = path.join(repoRoot, pathedPub)
  if (runPathname && fs.existsSync(pathedPubPath)) {
    zipArgs.push(
      path.join(pathedPubPath, '_site'),
      path.join(pathedPubPath, '_epub'),
      path.join(pathedPubPath, 'epubjs.epub')
    )
  }

  // Only run zip if we have files to zip
  if (zipArgs.length > 2) {
    await execa('zip', zipArgs)
  }
})