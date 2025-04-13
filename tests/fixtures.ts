import { test as base, expect } from '@playwright/test';

interface CustomFixtures {
  myFixture: void;
}

export const test = base.extend<CustomFixtures>({
  myFixture: async ({ page }, use) => {
    await page.goto('/');
    await use(undefined);
  },
});

export { expect };
