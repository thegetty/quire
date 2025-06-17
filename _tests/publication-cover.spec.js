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
