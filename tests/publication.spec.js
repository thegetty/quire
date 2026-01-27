/**
 * publication-cover.spec.js
 * 
 * Browser testing for the publication's index page / cover page.
 * 
 * These tests run on each platform's publication build, walking the sitemap to test each page. 
 * Each page gets a few specific tests:
 * - Page has a title
 * - src attributes used by img tags do not 404
 * - canvas-panel elements' inner canvas has dimensions (ie, IIIF images loaded correctly)
 * 
 **/ 

import { expect, test } from '@playwright/test'
import { JSDOM } from 'jsdom'
import { readFile, readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * @function checkUrl
 * 
 * @argument {String} url
 * @argument {Page} page
 * 
 * Checks the input url is valid and returns a good response
 * 
 **/ 
const checkUrl = async (url, page) => {
  if (!url) {
    test.fail('img URLs must not be empty', () => {})
    return
  }

  const parsed = new URL(url)
  const req = await page.request.get(parsed.href)
  await expect.soft(req).toBeOK()    
}

/**
 * @function checkCanvasPanelCanvasDims
 * 
 * @argument {Page} page
 * 
 * Checks whether canas-panel inner canvas elements have non-zero dimensions
 * 
 **/ 
const checkCanvasPanelCanvasDims = async (page) => {
  await page.waitForTimeout(2000)
  const canvasLocators = page.locator('canvas-panel canvas')
  const canvases = await canvasLocators.all()  

  // Get all canvases height and width attributes, verify they're non-zero
  const canvasDims = await Promise.all(canvases.map( async (canv) => {
    return { 
             height: await canv.getAttribute('height'), 
             width: await canv.getAttribute('width') 
           } 
  }))

  canvasDims.forEach( (dim) => {
    expect.soft(Number(dim.height ?? 0)).toBeGreaterThan(0)
    expect.soft(Number(dim.width ?? 0)).toBeGreaterThan(0)
  })
}

/**
 * @function checkAllImgsOK
 * 
 * @argument {Page} page
 * 
 * Checks the @src attributes of all img tags
 * 
 **/ 
const checkAllImgsOK = async (page) => {
  const pageUrl = page.url()
  const imgLoc = page.locator('img')
  const imgs = await imgLoc.all()  

  // Get all the src attributes and root them to localhost:8080 if they aren't valid URLs
  const imgHrefs = await Promise.all(imgs.map( async (img) => await img.getAttribute('src') ))
  const imgUrls = imgHrefs.map( (href) => {
    let url

    try {
      url = new URL(href, pageUrl)
    } catch {
      test.fail(`${href} could not be parsed into a valid URL`)
    }

    return url
  })

  await Promise.all( imgUrls.map( (u) => checkUrl(u,page) ) )
}

/**
 * @function checkLightboxSlides
 * 
 * @argument {Page} page
 * 
 * Checks that src attrs of all lightbox slide images work
 * 
 **/ 
const checkLightboxSlides = async (page) => {
  // Find each figure image on the page, click it
  // TODO: Drill shadowRoots
  const modal = await page.locator('q-modal').first()
  const lightbox = await modal.locator('q-lightbox').first()

  for ( const slideImg of await lightbox.locator('.q-lightbox-slides__element--image > img').all() ) {
    const src = await slideImg.getAttribute('src')

    let url
    try {
      url = new URL(src)
    } catch {
      url = new URL(src,'http://localhost:8080/')
    }
    console.log(url.href)
    await checkUrl(url.href, page)
  }
}

/**
 * @function loadSitemapUrls
 * 
 * @param {String} sitemapPath Path on disk to the sitemap
 * 
 * @returns {Array} All URLs from the sitemap
 * 
 * Loads a sitemap synchronously from disk (to mesh w/ playwright's declarative tests)
 **/ 
const loadSitemapUrls = (sitemapPath) => {  
  // Use the JSDOM's potted DOMParser implementation for the XML
  const dom = new JSDOM()
  const parser = new dom.window.DOMParser()

  let urls = []
  const body = readFileSync(sitemapPath).toString()
  const sitemap = parser.parseFromString(body, 'text/xml')

  sitemap.querySelectorAll('urlset > url > loc').forEach( loc => {
    if (!loc.textContent) return
    urls.push(loc.textContent)
  })

  return urls
}

// Add the PDF, URLs from the prime publication, and URLs from the pathed publication
let siteURLs = !!process.env.QUIRE_TEST_PUB_PATHNAME ? [] : [ 'http://localhost:8080/pdf.html' ]
siteURLs = siteURLs.concat(loadSitemapUrls(path.join('_site-test','sitemap.xml')))

for (const url of siteURLs) {
  if (!url) continue

  test(`${url} should have non-empty title, valid images`, async ({ page }) => {
    await page.goto(url)
    await page.waitForLoadState('domcontentloaded')
    await expect.soft(page).toHaveTitle(/.{1,}/)
    await checkAllImgsOK(page)
    await checkCanvasPanelCanvasDims(page)
    // await checkLightboxSlides(page)
  })  
}
