import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default defineConfig({
  timeout: 60000,
  workers: process.env.CI ? 4 : 1,
  retries: 2,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      slowMo: 500,
    },
  },
  globalSetup: require.resolve('./global-setup.ts'),
  projects: [
    {
      name: 'setup',
      testMatch: /global-setup\.ts/,
    },
    {
      name: 'auth',
      testMatch: '**/auth/**',
      use: {
        storageState: undefined,
      },
    },
    {
      name: 'authenticated',
      testMatch: '**/!(auth|global-setup).spec.ts',
      dependencies: ['setup'],
      use: {
        storageState: 'playwright/.auth/user.json',
      },
    },
  ],
});
