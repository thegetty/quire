// @ts-check
import 'dotenv/config'
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration
 * @see https://playwright.dev/docs/test-configuration
 *
 * environment variables are read from a .env file
 * @see https://github.com/motdotla/dotenv
 */
export default defineConfig({
  /**
   * @see https://playwright.dev/docs/test-snapshots
   */
  expect: {
    toHaveScreenshot: { maxDiffPixels: 100 },
  },
  /**
   * Run tests in files in parallel
   */
  fullyParallel: true,
  /**
   * Fail the build on CI if you accidentally left test.only in the source code
   */
  forbidOnly: !!process.env.CI,
  /**
   * Configure browsers, mobile device, and viewports on which tests are run
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'iOS Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
  /**
   * Reporters to use
   * @see https://playwright.dev/docs/test-reporters
   */
  reporter: [
    // ['html', { open: 'never', outputFolder: 'reports' }],
    // ['json', { outputFile: 'reports/test-results.json' }],
    ['list', { printSteps: true }],
  ],
  /**
   * Retry on CI only
   */
  retries: process.env.CI ? 2 : 0,
  /**
   * Relative path to the directory of test files
   */
  testDir: './_tests',
  /**
   * Glob patterns or regular expressions to ignore test files
   */
  testIgnore: '*test-assets',
  /**
   * Glob patterns or regular expressions that match test files
   */
  testMatch: '*tests/*.spec.js',
  /**
   * Shared settings for all the projects below.
   * @see https://playwright.dev/docs/api/class-testoptions
   */
  use: {
    /**
     * Base URL to use in actions such as `await page.goto('/')`
     */
    baseURL: 'http://127.0.0.1:8080',
    /**
     * Collect trace when retrying the failed test
     * @see https://playwright.dev/docs/trace-viewer
     */
    trace: 'on-first-retry',
  },
  /**
   * Run your local dev server before starting the tests
   * @see https://playwright.dev/docs/test-webserver
   */
  webServer: {
    command: 'npm run serve',
    reuseExistingServer: !process.env.CI,
    url: 'http://127.0.0.1:8080',
  },
  /**
   * Opt out of parallel tests in CI
   */
  workers: process.env.CI ? 1 : undefined,
})
