import fs from 'node:fs'
import { execa } from 'execa'
import path from 'node:path'
import test from 'ava'
import { test as pwTest, expect as pwExpect } from '@playwright/test'

const publicationName = 'test-publication'

const eleventyPath = path.join( process.cwd() , 'packages', '11ty' )
const publicationPath = path.join( process.cwd(), publicationName )
const publicationZip = path.join( process.cwd(), 'publication.zip' )

test.serial('Create the default publication', async (t) => {
	const newCmd = await execa('quire', ['new', '--debug', '--quire-path', eleventyPath, publicationName ])
	t.pass()
})

test.serial('Build the default publication', async (t) => {
	process.chdir( publicationPath )
	const buildCmd = await execa('quire', ['build'])
	t.pass()
})

test.serial('Build the default publication\'s pdf', async (t) => {
	process.chdir( publicationPath )
	const pdfCmd = await execa('quire', ['pdf'])
	t.pass()
})

test.serial('Build the default publication\'s epub', async (t) => {
	process.chdir( publicationPath )
	const epubCmd = await execa('quire', ['epub'])
	t.pass()
})

test.serial()
test.after(async (t) => {
	await execa('zip', ['-r', publicationZip, path.join(publicationPath, '_site'), path.join(publicationPath, '_epub')])
	// fs.rmSync(publicationPath, {recursive: true, force: true})
})