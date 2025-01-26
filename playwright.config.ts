import { defineConfig, devices } from '@playwright/test';
import * as os from "node:os";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in await expect(locator).toHaveText();
     */
    timeout: 10 * 1000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['json', {  outputFile: 'reports/json-report/report.json' }],
    ['html', { outputFolder: 'reports/html-report/', open: 'never' }],
    ['junit', { outputFile: 'reports/junit-report/report.xml' }],
    ['@estruyf/github-actions-reporter'],
    ['monocart-reporter', { name: "Monocart Report", outputFile: 'reports/monocart-report/index.html' }],
    [
      "allure-playwright",
      {
        resultsDir: "reports/allure-report",
        detail: true,
        suiteTitle: true,
        // links: {
        //   issue: {
        //     nameTemplate: "Issue #%s",
        //     urlTemplate: "https://issues.example.com/%s",
        //   },
        //   tms: {
        //     nameTemplate: "TMS #%s",
        //     urlTemplate: "https://tms.example.com/%s",
        //   },
        //   jira: {
        //     urlTemplate: (v) => `https://jira.example.com/browse/${v}`,
        //   },
        // },
        categories: [
          {
            name: "Reports",
            messageRegex: "bar",
            traceRegex: "baz",
            // matchedStatuses: [Status.FAILED, Status.BROKEN],
          },
        ],
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
          process_platform: process.platform,
        },
        storeTrends: true,
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://nodeexpressapi-39yx.onrender.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    headless: true,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
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

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
