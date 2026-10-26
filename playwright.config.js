// Browser tests for the app (tests/*.spec.js). Run them with `npm test`.
// First time on a new machine: npx playwright install chromium
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:4173',
    // A phone-sized screen, like the app is used on
    viewport: { width: 375, height: 667 },
    // Most tests run without the offline cache so every load gets the files on disk; offline.spec.js turns it on
    serviceWorkers: 'block',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI
  }
});
