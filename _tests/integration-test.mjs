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
 * @function buildSitePdfEpub
 * 
 * @param {ava:test} t
 * 
 * Builds a quire site, its pdf and epub.
 * 
 **/ 
const buildSitePdfEpub = async (t) => {
  const buildCmd = await execa('quire', ['build'])
  const {stdout, stderr} = await execa('quire', ['pdf'])
  const epubCmd = await execa('quire', ['epub'])

  const downloadsDir = path.join('_site', '_assets', 'downloads')
  const publicationPdf = path.join(downloadsDir, 'publication.pdf')
  if (!fs.existsSync(publicationPdf)) {
    t.fail(`No publication PDF generated! ${stdout} ${stderr}`)
  }

  const essayPdf = path.join(downloadsDir, 'publication-essay.pdf')
  if (!fs.existsSync(essayPdf)) {
    t.fail(`No essay PDF generated! ${stdout} ${stderr}`)
  }

  const epubDir = '_epub'
  if (!fs.existsSync(epubDir)) {
    t.fail(`No epub generated! ${stdout} ${stderr}`)
  }
}

test.serial('Create the default publication and build the site, epub, pdf', async (t) => {
  const newCmd = await execa('quire', ['new', '--debug', '--quire-path', eleventyPath, publicationName ])

  process.chdir(publicationName)
  await buildSitePdfEpub(t)
  process.chdir(repoRoot)
  t.pass()
})

test.serial('Create the default publication with a pathname and build the site, epub, pdf', async (t) => {
  const newCmd = await execa('quire', ['new', '--debug', '--quire-path', eleventyPath, pathedPub ])

  process.chdir(pathedPub)
  changePubUrl(`http://localhost:8181/${ pathedPub }/`, t)

  await buildSitePdfEpub()
  process.chdir(repoRoot)
  t.pass()
})

// Package built site products for artifact storage and stage pathed publication
test.after(async (t) => {
  fs.renameSync(path.join(pathedPub, '_site'), path.join(pathedPub, pathedPub))
  await execa('zip', ['-r', publicationZip, path.join(publicationPath, '_site'), path.join(publicationPath, '_epub')])
})