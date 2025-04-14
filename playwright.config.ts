import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default defineConfig({
  timeout: process.env.CI ? 20000 : 10000,
  workers: process.env.CI ? 4 : 1,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      slowMo: 500,
    },
    headless: process.env.CI ? true : false,
  },
  projects: [
    {
      name: 'auth',
      testMatch: 'ui/auth/**/*.spec.ts',
    },
    {
      name: 'authenticated',
      testMatch: 'ui/**/*.spec.ts',
    },
    {
      name: 'api',
      testMatch: 'api/**/*.spec.ts',
      use: {
        baseURL: 'https://autodemos.atlassian.net',
      },
    },
  ],
});
