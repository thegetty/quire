// @ts-check
/**
 * publication-cover.spec.js
 * 
 * Browser testing for the publication's index page / cover page 
 * 
 **/ 
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/catalogue/2/')
  await page.waitForLoadState('domcontentloaded')
})

test('page title', async ({ page }) => {
  await expect(page).toHaveTitle(/Bud Fields with His Wife Ivy, and His Duaghter Ellen, Hale County, Alabama | New Deal Photography/)
})

test('image tags contain valid URLs', async ({ page }) => {
  // Locate all the img tags, make sure they're not empty and parse as URLs
  const imgLoc = page.locator('img')
  const imgs = await imgLoc.all()  
  const imgHrefs = await Promise.all( imgs.map( img => img.getAttribute('src')) )

  imgHrefs.forEach( async (imgSrc) => {
    if (!imgSrc) {
      test.fail('img URLs must not be empty', () => {})
      return
    }

    const url = new URL(imgSrc, 'http://localhost:8080')
    const req = await page.request.get(url.href)
    expect(req.status()).toBe(200)
  })
})