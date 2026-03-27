import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/_tests_',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        browserName: 'chromium',
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
  },
});
