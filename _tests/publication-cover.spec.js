// @ts-check
/**
 * publication-cover.spec.js
 * 
 * Browser testing for the publication's index page / cover page 
 * 
 **/ 
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/')
})

test('page title', async ({ page }) => {
  await expect(page).toHaveTitle(/Cover \| New Deal Photography/)
})

test('screenshot', async ({ page }) => {
  await expect(page).toHaveScreenshot('cover.png')
})

test('toc menu', async ({ page }) => {
  const tocToggle = await page.getByRole('button', { name: 'Table of Contents' })
  await tocToggle.click()
  await tocToggle.hover()
  await expect(page).toHaveScreenshot('cover-toc-open.png')
  await tocToggle.click()
  await expect(page).toHaveScreenshot('cover-toc-closed.png')
})

test('search window', async ({ page }) => {
  const searchButton = await page.getByRole('button', { name: 'Search' })
  await searchButton.click()
  await expect(page).toHaveScreenshot('search-open.png')
  const closeButton = await page.getByRole('button', { name: 'Close search window' })
  await closeButton.click()
  await expect(page).toHaveScreenshot('search-closed.png')
})