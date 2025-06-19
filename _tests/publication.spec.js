// @ts-check
/**
 * publication-cover.spec.js
 * 
 * Browser testing for the publication's index page / cover page 
 * 
 **/ 
import { expect, test } from '@playwright/test'
import { JSDOM } from 'jsdom'
import { readFile, readFileSync } from 'node:fs'
import path from 'node:path'

const allImagesValid = async (page) => {
  const imgLoc = page.locator('img')
  const imgs = await imgLoc.all()  
  const imgHrefs = await Promise.all(imgs.map( async (img) => await img.getAttribute('src') ))

  const checkHref = async (imgSrc) => {
    if (!imgSrc) {
      test.fail('img URLs must not be empty', () => {})
      return
    }

    const url = new URL(imgSrc, 'http://localhost:8080')
    const req = await page.request.get(url.href)
    await expect.soft(req).toBeOK()    
  }

  await Promise.all( imgHrefs.map( checkHref ) )
}

let siteURLs = []

const dom = new JSDOM()
const parser = new dom.window.DOMParser()

// @TODO: Replace this with a fetch from localhost:8080/sitemap.xml
const body = readFileSync(path.join('test-publication','_site','sitemap.xml')).toString()
const sitemap = parser.parseFromString(body, 'text/xml')

siteURLs = Array.from(sitemap.querySelectorAll('urlset > url > loc'))
                  .map( loc => loc.textContent )


for (const url of siteURLs) {
  if (!url) continue

  test(`${url} should have non-empty title, valid images`, async ({ page }) => {
    await page.goto(url)
    await page.waitForLoadState('domcontentloaded')
    await expect.soft(page).toHaveTitle(/.{1,}/)
    await allImagesValid(page)
  })  
}
