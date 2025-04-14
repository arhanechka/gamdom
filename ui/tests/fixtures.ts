import { test as base, expect } from '@playwright/test';
import { AuthPage } from '@pages/auth.page';
import { MainPage } from '@pages/main.page';

interface CustomFixtures {
  myFixture: void;
}

export const test = base.extend<CustomFixtures>({
  myFixture: async ({ page }, use) => {
    await page.goto('/');
    await use(undefined);
  },
});

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'auth') {
    return;
  }

  const auth = new AuthPage(page);
  const main = new MainPage(page);

  await auth.navigateToLogin();

  if (await auth.isLoginPageVisible()) {
    await auth.openLoginForm();
    const username = process.env.TEST_USERNAME || 'default_user';
    const password = process.env.TEST_PASSWORD || 'default_pass';
    await auth.login(username, password);
    await main.expectSuccessfulLogin();
  }
});

export { expect };
