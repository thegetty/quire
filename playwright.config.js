// @ts-check
import { defineConfig, devices } from '@playwright/test';

const pathnameTesting = !!process.env.QUIRE_TEST_PUB_PATHNAME

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  expect: { toHaveScreenshot: { maxDiffPixels: 100 } },
  testDir: './_tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: undefined, //process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['junit', {printSteps: true, outputFile: pathnameTesting ? 'reports/publication-browser-pathname.xml' :  'reports/publication-browser.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /publication-setup\.js/
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup']
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup']
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup']
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [{
    command: 'npm run test:serve',
    url: 'http://localhost:8080',
    timeout: 120 * 1000,
    // reuseExistingServer: !process.env.CI,
  }]
});

