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
  const imgLoc = page.locator('img')
  const imgs = await imgLoc.all()  

  // Get all the src attributes and root them to localhost:8080 if they aren't valid URLs
  const imgHrefs = await Promise.all(imgs.map( async (img) => await img.getAttribute('src') ))
  const imgUrls = imgHrefs.map( (href) => {
    let url
    try {
      url = new URL(href)
    } catch {
      url = new URL(href,'http://localhost:8080/')
    }

    return url
  })

  await Promise.all( imgUrls.map( (u) => checkUrl(u,page) ) )
}

let siteURLs = [ 'http://localhost:8080/pdf.html' ]

const dom = new JSDOM()
const parser = new dom.window.DOMParser()

// Load the sitemap synchronously because playwright requires declarative tests
const body = readFileSync(path.join('test-publication','_site','sitemap.xml')).toString()
const sitemap = parser.parseFromString(body, 'text/xml')
sitemap.querySelectorAll('urlset > url > loc').forEach( loc => {
  if (!loc.textContent) return
  siteURLs.push(loc.textContent)
})

for (const url of siteURLs) {
  if (!url) continue

  test(`${url} should have non-empty title, valid images`, async ({ page }) => {
    await page.goto(url)
    await page.waitForLoadState('domcontentloaded')
    await expect.soft(page).toHaveTitle(/.{1,}/)
    await checkAllImgsOK(page)
    await checkCanvasPanelCanvasDims(page)
  })  
}
