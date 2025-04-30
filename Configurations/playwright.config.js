// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { on } = require('events');
import { testPlanFilter } from "allure-playwright/dist/testplan";
import * as os from "os";

const currenWorkingDirectory = process.cwd();

// Determine the device configuration based on the environment variable
const getDeviceConfig = () => {
  const deviceName = process.env.DEVICE || 'Desktop Chrome';
  const deviceConfig = devices[deviceName];

  if (!deviceConfig) {
      console.warn(`Device '${deviceName}' not found. Using 'Desktop Chrome' as fallback.`);
      return devices['Desktop Chrome'];
  }

  return deviceConfig;
};

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: currenWorkingDirectory + '/tests',
  timeout : 1*7*60*1000,
  // timeout : 60000,
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
    // ["./Reporters/TestRailReporter.ts"],
    ["allure-playwright",
      {
        detail: true,
        outputFolder: currenWorkingDirectory+"/allure-results",
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
    ['junit', { embedAnnotationsAsProperties: true, outputFile: currenWorkingDirectory+'/test-results/e2e-junit-results.xml' }],
  ],
  
  grep: testPlanFilter(),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: 'on-first-retry',
    actionTimeout: 30000,
    // Default test timeout (not just action/assert)
    timeout: 30000, // 30 seconds per test
    trace: 'off',
    screenshot : { mode: 'on', fullPage: true},
    video : 'on-first-retry',
    //baseURL : "https://development-instance.worldmarket.com/",
    headless : false,
    ignoreHTTPSErrors: true,
     browserName : "chromium",
     navigationTimeout: 60000,
    // channel: 'chrome',
    ...getDeviceConfig(),
    // permissions: ["clipboard-read"],
    args: [
      '--disable-gpu', // Disables GPU hardware acceleration. If software renderer is not in place, this can help avoid errors.
      '--no-sandbox', // Disables the sandbox for all process types that are normally sandboxed.
      '--disable-setuid-sandbox', // Disables the setuid sandbox (Linux only).
      '--ignore-certificate-errors', // Ignores certificate errors, allowing testing on sites with invalid certs.
      '--ignore-ssl-errors', // Similar to ignore certificate errors but for SSL protocol errors.
  ],
  },

  /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },

  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },

  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },

  //   /* Test against mobile viewports. */
  //   {
  //     name: 'Mobile Chrome',
  //     use: { ...devices['Pixel 5'] },
  //   },
  //   {
  //     name: 'Mobile Safari',
  //     use: { ...devices['iPhone 12'] },
  //   },

  //   /* Test against branded browsers. */
  //   {
  //     name: 'Microsoft Edge',
  //     use: { ...devices['Desktop Edge'], channel: 'msedge' },
  //   },
  //   {
  //     name: 'chrome',
  //     use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  //   },
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

