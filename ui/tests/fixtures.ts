import { test as base, expect } from '@playwright/test';
import { AuthPage } from '@pages/auth.page';
import { MainPage } from '@pages/main.page';

/**
 * Test fixtures to initialize page objects and perform common actions.
 *
 * Fixtures:
 * 1. `authPage`: Handles authentication flow.
 * 2. `mainPage`: Represents the main page after login.
 * 3. `myFixture`: Initializes the home page.
 */
interface PageObjects {
  authPage: AuthPage;
  mainPage: MainPage;
}

interface CustomFixtures extends PageObjects {
  myFixture: void;
}

export const test = base.extend<CustomFixtures>({
  myFixture: async ({ page }, use) => {
    await page.goto('/');
    await use(undefined);
  },

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  mainPage: async ({ page }, use) => {
    await use(new MainPage(page));
  },
});

/**
 * Runs before each test. Initializes login flow for non-auth related tests.
 */
test.beforeEach(async ({ page, authPage, mainPage }, testInfo) => {
  await page.goto('/');

  if (testInfo.project.name === 'auth') return;

  await authPage.navigateToLogin();

  if (await authPage.isLoginPageVisible()) {
    await authPage.openLoginForm();
    const username = process.env.TEST_USERNAME || 'default_user';
    const password = process.env.TEST_PASSWORD || 'default_pass';
    await authPage.login(username, password);
    await mainPage.expectSuccessfulLogin();
  }
});

export { expect };
