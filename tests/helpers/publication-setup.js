/**
 * @script publication-setup.js
 * 
 * Stages publications in the site test directory
 * 
 **/ 

import fs from 'node:fs'
import path from 'node:path'

// Test publication type locations
const publication = path.join('test-publication','_site')
const pathnamePublication = path.join('test-publication-pathname', '_site')
const pathnameSitemap = path.join(pathnamePublication, 'sitemap.xml')

// Destination mounts
const site = '_site-test'
const pathnameSite = path.join(site, 'test-publication-pathname')
const sitemap = path.join(site, 'sitemap.xml')

if (fs.existsSync(site)) {
  fs.rmSync(site, {recursive: true, force: true})  
}
fs.mkdirSync(site)

// Copy with pathname if the env var is set
if (!!process.env.QUIRE_TEST_PUB_PATHNAME) {
  console.log("Pub pathing it",pathnamePublication, pathnameSite)
  fs.cpSync(pathnamePublication, pathnameSite, {recursive: true})  
  fs.cpSync(pathnameSitemap, sitemap)
} else {
  fs.cpSync(publication, site, {recursive: true})
}


