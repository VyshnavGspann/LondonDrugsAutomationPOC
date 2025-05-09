// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { on } = require('events');
import { testPlanFilter } from "allure-playwright/dist/testplan";
import * as os from "os";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout : 120000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 5 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["line"], 
    ["./Reporters/TestRailReporter.ts"],
    ["allure-playwright",
      {
        detail: true,
        outputFolder: "allure-results",
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
    ['junit', { embedAnnotationsAsProperties: true, outputFile: 'test-results/e2e-junit-results.xml' }],
  ],
  
  grep: testPlanFilter(),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot : { mode: 'on', fullPage: true},
    video : 'on-first-retry',
    //baseURL : "https://development-instance.worldmarket.com/",
    headless : true,
    ignoreHTTPSErrors: true,
    browserName : "chromium",
    ...devices['Desktop Chrome'],
    permissions: ["clipboard-read"]
  },

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

