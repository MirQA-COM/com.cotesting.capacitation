// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const localAppUrl = `${pathToFileURL(path.join(__dirname, '..', '..', 'apps', 'web', 'src')).href}/`;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || localAppUrl;

module.exports = defineConfig({
  testDir: '.',
  testIgnore: ['pages/**'],
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/e2e-results.xml' }]
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
