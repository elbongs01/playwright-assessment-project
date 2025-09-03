// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
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
    ['monocart-reporter', {
      name: "SauceDemo Test Report",
      outputFile: './test-results/monocart-report.html',
      
      // Custom styling
      theme: 'dark',
      
      // Custom columns in the report
      columns: [
        'index',
        'title', 
        'duration',
        'status',
        {
          name: 'project',
          align: 'center'
        }
      ],
      
      // Custom attachments
      attachments: {
        video: 'on-failure',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
      },
      
      // Custom metadata
      metadata: {
        'Test Environment': 'SauceDemo',
        'Test Type': 'E2E UI Tests',
        'Browser': 'Multi-browser',
        'OS': 'Windows'
      },

      // Trend analysis
      trend: './test-results/monocart-trend.json'
    }],
    ['html']  // Keep default HTML reporter as well
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
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    ///   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
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
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

