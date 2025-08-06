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

test.serial('Create the default publication', async (t) => {
  const newCmd = await execa('quire', ['new', '--debug', '--quire-path', eleventyPath, publicationName ])
  t.pass()
})

test.serial('Build the default publication with a pathPrefix', async (t) => {
  process.chdir( publicationPath )

  changePubUrl('http://localhost:8080/test-path/', t)
  const buildCmd = await execa('quire', ['build'])
  changePubUrl('http://localhost:8080', t)

  t.pass()
})

test.serial('Build the default publication', async (t) => {
  process.chdir( publicationPath )
  const buildCmd = await execa('quire', ['build'])
  t.pass()
})

test.serial('Build the default publication\'s pdf', async (t) => {
  process.chdir( publicationPath )
  const {stdout, stderr} = await execa('quire', ['pdf'])

  const downloadsDir = path.join('_site', '_assets', 'downloads')

  const publicationPdf = path.join(downloadsDir, 'publication.pdf')
  if (!fs.existsSync(publicationPdf)) {
    t.fail(`No publication PDF generated! ${stdout} ${stderr}`)
  }

  const essayPdf = path.join(downloadsDir, 'publication-essay.pdf')
  if (!fs.existsSync(essayPdf)) {
    t.fail(`No essay PDF generated! ${stdout} ${stderr}`)
  }

  t.pass()
})

test.serial('Build the default publication\'s epub', async (t) => {
  process.chdir( publicationPath )
  const epubCmd = await execa('quire', ['epub'])
  t.pass()
})

test.after(async (t) => {
  await execa('zip', ['-r', publicationZip, path.join(publicationPath, '_site'), path.join(publicationPath, '_epub')])
})