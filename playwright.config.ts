import { defineConfig, devices } from '@playwright/test';
import * as os from "node:os";
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// @ts-ignore
import dotenv from 'dotenv';
// @ts-ignore
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  tsconfig: './tsconfig.json',

  testDir: './tests',
  testIgnore: 'template*',
  outputDir: './reports/test-results',
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in await expect(locator).toHaveText();
     */
    timeout: 2 * 1000,
  },

  /* Run tests in files in parallel */
  fullyParallel: false,
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
        categories: [
          {
            name: "Reports",
            messageRegex: "bar",
            traceRegex: "baz",
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
    baseURL: process.env.URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    headless: true,
    testIdAttribute: 'id',

    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Setup',
      testMatch: /.*\.setup\.ts/,
      timeout: 200 * 1000,
    },
    {
      name: 'chromium',
      testMatch: /.*\.test\.ts/,
      timeout: 30 * 1000,
      use: {
        ...devices['Desktop Chrome'],
        headless: !!process.env.CI,
      },
      dependencies: ['Setup'],
    },

    {
      name: 'firefox',
      testMatch: /.*\.test\.ts/,
      timeout: 30 * 1000,
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['Setup'],
    },

    {
      name: 'webkit',
      testMatch: /.*\.test\.ts/,
      timeout: 30 * 1000,
      use: { ...devices['Desktop Webkit'] },
      dependencies: ['Setup'],
    },

  ],
});
